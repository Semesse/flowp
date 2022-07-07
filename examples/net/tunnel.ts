import net from 'net'
import dgram from 'dgram'
import assert from 'assert'
import { promisify } from 'util'
import { Channel } from '../../src'
import { ChannelSplitter } from '../../src/control/channel_splitter'
import { ChannelHub } from '../../src/control/channel_hub'
import { PipeEndpoint, PipeToConsole } from '../../src/control/pipeable'
import { Future, PipeAdapter } from '../../dist'

export interface Disposable {
  dispose: () => Promise<void> | void
}
export interface Protocol<T = Buffer> {
  reader: () => Channel<T>
  writer: () => Channel<T>
}

export enum SocketType {
  IPv4,
  IPv6,
}

export enum UDPDirectionType {
  Server,
  Client,
}

export type StreamProtocol = Protocol<Buffer>
export type DatagramProtocol = Protocol<[Buffer, dgram.RemoteInfo]>

export class TCPConnection implements StreamProtocol {
  public readonly socket?: net.Socket
  private readChan: Channel<Buffer>
  private writeChan: Channel<Buffer>
  private _reader: ChannelSplitter<Buffer>
  private _writer: ChannelHub<Buffer>

  public constructor(socket: net.Socket) {
    this.socket = socket
    this.readChan = new Channel<Buffer>()
    this.writeChan = new Channel<Buffer>()
    this._reader = new ChannelSplitter<Buffer>(this.readChan)
    this._writer = new ChannelHub<Buffer>(this.writeChan)
    this.socket.on('data', (buf) => {
      this.readChan.send(buf)
    })
    this.socket.on('end', () => {
      this._reader.close()
      this._writer.close()
    })
    this._writer.pipe(new PipeEndpoint((m) => this.socket?.write(m)))
  }

  /** reader to read data from tcp connection */
  public reader(): Channel<Buffer> {
    assert(this.socket?.readable)
    return this._reader?.fork()
  }

  /** writer to write data to tcp connection */
  public writer(): Channel<Buffer> {
    assert(this.socket?.writable)
    return this._writer.fork()
  }

  public close() {
    this.socket?.end()
  }

  public async loop() {
    for await (const b of this._writer.stream()) {
      const res = this.socket?.write(b)
      if (!res)
        await new Promise((r) => {
          this.socket?.once('drain', r)
        })
    }
  }
}

export class TCPServer extends Channel<TCPConnection> {
  private server?: net.Server
  public constructor() {
    super()
  }
  public async listen(port: number, host?: string) {
    this.server = net.createServer()
    this.server.on('connection', (socket) => this.send(new TCPConnection(socket)))
    this.server.on('error', console.error)

    const listening = new Promise((r) => {
      this.server?.on('listening', r)
    })
    this.server.listen(port, host)
    return listening
  }
}

export class UDPConnection implements DatagramProtocol {
  public readonly socket: dgram.Socket
  private readChan: Channel<[Buffer, dgram.RemoteInfo]>
  private writeChan: Channel<[Buffer, dgram.RemoteInfo]>
  private _reader: ChannelSplitter<[Buffer, dgram.RemoteInfo]>
  private _writer: ChannelHub<[Buffer, dgram.RemoteInfo]>
  private ready: Future<void>

  public constructor(type: UDPDirectionType, port: number, host?: string) {
    const socketType = host ? (net.isIPv4(host) ? 'udp4' : net.isIPv6(host) ? 'udp6' : null) : 'udp4'
    if (!socketType) throw new Error(`Invalid UDP server host ${host}`)
    this.readChan = new Channel<[Buffer, dgram.RemoteInfo]>()
    this.writeChan = new Channel<[Buffer, dgram.RemoteInfo]>()
    this._reader = new ChannelSplitter<[Buffer, dgram.RemoteInfo]>(this.readChan)
    this._writer = new ChannelHub<[Buffer, dgram.RemoteInfo]>(this.writeChan)
    this.ready = new Future<void>()
    this.socket = dgram.createSocket('udp4')
    this.socket.on('message', (m, remote) => this.readChan.send([m, remote]))
    this.socket.on('error', console.error)
    this.socket.on('end', () => {
      this._reader.close()
      this._writer.close()
    })
    this.loop()
    if (type === UDPDirectionType.Client) {
      this.socket.on('connect', () => this.ready.resolve())
      this.socket.connect(port, host)
    } else {
      this.socket.on('listening', () => this.ready.resolve())
      this.socket.bind(port, host)
    }
  }

  /** reader to read data from tcp connection */
  public reader(): Channel<[Buffer, dgram.RemoteInfo]> {
    return this._reader?.fork()
  }

  /** writer to write data to tcp connection */
  public writer(): Channel<[Buffer, dgram.RemoteInfo]> {
    return this._writer.fork()
  }

  public close() {
    this.socket?.close()
  }

  public async loop() {
    await this.ready
    for await (const [b, remote] of this._writer.stream()) {
      this.socket.send(b, remote.port, remote.address)
    }
  }
}

export class ProtocolRouter<T extends Protocol> {
  private inbound: T
  private outbound: T
  public constructor(inbound: T, outbound: T) {
    this.inbound = inbound
    this.outbound = outbound
  }
  public start() {
    this.inbound.reader().pipe(this.outbound.writer())
    this.outbound.reader().pipe(this.inbound.writer())
  }
}

async function handleConn(conn: TCPConnection) {
  console.log('new connection', conn.socket?.remoteAddress)
  const targetConn = new TCPConnection(net.connect(5201, '127.0.0.1'))

  conn.reader().pipe(targetConn.writer())
  targetConn.reader().pipe(conn.writer())

  conn.socket?.on('close', () => targetConn.close())
  targetConn.socket?.on('close', () => conn.close())
  conn.socket?.on('end', () => targetConn.socket?.end())
  targetConn.socket?.on('end', () => conn.socket?.end())
  conn.socket?.on('error', () => targetConn.socket?.end())
  targetConn.socket?.on('error', () => conn.socket?.end())
}

async function tcpmain() {
  const tcpServer = new TCPServer()
  tcpServer.listen(3001, '127.0.0.1')
  for await (const conn of tcpServer.stream()) {
    handleConn(conn)
  }
}

async function udpmain() {
  tcpmain()
  const udpServer = new UDPConnection(UDPDirectionType.Server, 3001, '127.0.0.1')
  const udpClient = new UDPConnection(UDPDirectionType.Client, 5201, '127.0.0.1')
  // udpServer.reader().pipe(new PipeToConsole())
  // udpClient.reader().pipe(new PipeToConsole())
  udpServer.reader().pipe(udpClient.writer())
  udpClient.reader().pipe(udpServer.writer())
  udpServer.socket?.on('close', () => udpClient.close())
  udpClient.socket?.on('close', () => udpServer.close())
}

udpmain()
