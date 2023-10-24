/* eslint-disable @typescript-eslint/no-require-imports */
const { version } = require('../package.json')
const preid = version.split('-').at(1)?.split('.')?.[0] || 'latest'
console.log(preid)
