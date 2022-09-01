import { ApiItem, ApiItemKind } from '@microsoft/api-extractor-model'
import { Visitor, ContainerNode, TerminalNode, IVisitMeta } from 'standard-markdown-documenter'

export interface DocusaurusContainerNode extends ContainerNode {
  id: string
  type: string
  kind: ApiItemKind
  parentKind?: ApiItemKind
  collapsed: boolean
}

export interface DocusaurusTerminalNode extends TerminalNode {
  type: string
  kind: ApiItemKind
  parentKind?: ApiItemKind
}

export function isContainerNode(
  node: DocusaurusContainerNode | DocusaurusTerminalNode
): node is DocusaurusContainerNode {
  return node.type === 'category'
}

export const SIDEBAR_VISITOR: Visitor<DocusaurusContainerNode, DocusaurusTerminalNode> = {
  [ApiItemKind.Package](apiItem: ApiItem, meta: IVisitMeta) {
    return ContainerNode(apiItem, meta)
  },
  [ApiItemKind.Namespace](apiItem: ApiItem, meta: IVisitMeta) {
    return ContainerNode(apiItem, meta)
  },
  [ApiItemKind.Interface](apiItem: ApiItem, meta: IVisitMeta) {
    return ContainerNode(apiItem, meta)
  },
  [ApiItemKind.Class](apiItem: ApiItem, meta: IVisitMeta) {
    return ContainerNode(apiItem, meta)
  },
  [ApiItemKind.CallSignature](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },
  [ApiItemKind.ConstructSignature](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },
  [ApiItemKind.Constructor](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },
  [ApiItemKind.Enum](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.EnumMember](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Function](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.IndexSignature](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Method](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Method](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.MethodSignature](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Property](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.PropertySignature](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.TypeAlias](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Variable](apiItem: ApiItem, meta: IVisitMeta) {
    return TerminalNode(apiItem, meta)
  },

  [ApiItemKind.Model]() {
    return {
      type: 'category',
      label: 'Packages',
      items: [],
      collapsed: false,
    }
  },
}

function ContainerNode(apiItem: ApiItem, meta: IVisitMeta): DocusaurusContainerNode {
  return {
    id: meta.id,
    type: 'category',
    label: apiItem.displayName,
    collapsed: true,
    kind: apiItem.kind,
    parentKind: apiItem.parent?.kind,
    members: apiItem.members.map((k) => k.displayName),
    items: [],
  } as any
}

function TerminalNode(apiItem: ApiItem, meta: IVisitMeta): DocusaurusTerminalNode {
  return {
    type: 'doc',
    label: apiItem.displayName,
    id: meta.id,
    parentKind: apiItem.parent?.kind,
    kind: apiItem.kind,
    members: apiItem.members.map((k) => k.displayName),
    items: [],
  } as any
}
