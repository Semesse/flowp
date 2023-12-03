import { dirname, join } from 'path'
import fs from 'fs-extra'
import type { IConfigFile } from '@microsoft/api-extractor'
import { ApiItemKind, ApiModel } from '@microsoft/api-extractor-model'
import { StandardMarkdownDocumenter } from 'standard-markdown-documenter'
import type { DocusaurusContainerNode, DocusaurusTerminalNode } from './site/sidebar'
import { isContainerNode, SIDEBAR_VISITOR } from './site/sidebar'
import json5 from 'json5'
import { DocDelegate } from './site/delegate'

// eslint-disable-next-line max-params
export async function generateMarkdownFiles(
  projectFolder: string,
  outDir: string,
  docBase: string,
  config: IConfigFile
): Promise<void> {
  try {
    fs.ensureDirSync(outDir)

    const model = new ApiModel()
    const modelDir = config.docModel?.apiJsonFilePath
      ? dirname(config.docModel?.apiJsonFilePath).replace('<projectFolder>', projectFolder)
      : join(projectFolder, 'tmp')

    model.loadPackage(join(modelDir, 'flowp.api.json'))

    const documenter = new StandardMarkdownDocumenter(new DocDelegate(model, outDir))

    await documenter.generateFiles()
    const sidebarNodes = await documenter.generateSidebar(SIDEBAR_VISITOR)

    const spine = sidebarNodes.map((node) => convertNode(node as DocusaurusContainerNode, docBase))
    // put index doc to package root
    spine[0].items.unshift({
      id: 'api/index',
      type: 'doc',
      label: 'Index',
    })
    fs.writeFileSync(join(outDir, 'sidebar.ts'), `export default ${JSON.stringify(spine, null, 2)}`)
  } catch (e) {
    console.error(e)
    process.exitCode = 1
  }
}

function convertNode(item: DocusaurusTerminalNode | DocusaurusContainerNode, docBase: string): any {
  if (isContainerNode(item)) {
    const children = item.items
      .filter((node) => isSideBarItem(node as DocusaurusTerminalNode | DocusaurusContainerNode))
      .map((node) => convertNode(node as DocusaurusTerminalNode | DocusaurusContainerNode, docBase))
    return children.length
      ? {
          // id: item.id ? `${docBase}/${item.id}` : undefined,
          type: item.type,
          label: item.label,
          items: children,
        }
      : {
          id: `${docBase}/${item.id}`,
          type: 'doc',
          label: item.label,
        }
  }
  return {
    id: `${docBase}/${item.id}`,
    type: item.type,
    label: item.label,
  }
}

function isSideBarItem(item: DocusaurusTerminalNode | DocusaurusContainerNode): boolean {
  return (
    [ApiItemKind.Model, ApiItemKind.Package, ApiItemKind.Namespace, ApiItemKind.Namespace].includes(item.parentKind!) ||
    [
      ApiItemKind.Model,
      ApiItemKind.Package,
      ApiItemKind.Namespace,
      ApiItemKind.Class,
      ApiItemKind.Function,
      ApiItemKind.Enum,
    ].includes(item.kind)
  )
}

;(async () => {
  const extractorConfig = json5.parse(fs.readFileSync('./api-extractor.json').toString())
  await generateMarkdownFiles(process.cwd(), './site/docs/api', 'api', extractorConfig)
  fs.copySync(join(process.cwd(), 'scripts/site/api-index.md'), './site/docs/api/index.md')
})()
