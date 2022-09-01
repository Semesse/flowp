import { ApiModel } from '@microsoft/api-extractor-model'
import { IWriteNodeContext } from 'standard-markdown-documenter/dist/interfaces'
import { InternalDelegate } from 'standard-markdown-documenter/dist/default-delegate'

export class DocDelegate extends InternalDelegate {
  public apiModel: ApiModel
  public constructor(public model: ApiModel, outDir: string) {
    super({ apiModel: model, outputFolder: outDir })
    this.apiModel = model
  }
  public writeNode(ctx: IWriteNodeContext) {
    // ignore errors
    return
  }
}
