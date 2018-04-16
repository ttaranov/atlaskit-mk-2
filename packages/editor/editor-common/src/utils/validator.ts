import { generateUuid as uuid } from './uuid';
import { defaultSchema } from '../schema';
import { Mark as PMMark, Schema } from 'prosemirror-model';
import { isSafeUrl } from '.';
import { inlineNodes } from '../schema';
import { CellAttributes } from '../schema/nodes/tableNodes';

export type ADFStage = 'stage0' | 'final';

export interface ADDoc {
  version: 1;
  type: 'doc';
  content: ADNode[];
}

export interface ADNode {
  type: string;
  attrs?: any;
  content?: ADNode[];
  marks?: ADMark[];
  text?: string;
}

export type ValidADNode = ADNode;

export interface ParsedADNode {
  type: string;
  attrs?: any;
  content?: ParsedADNode[];
  marks?: ADMark[];
  text?: string;

  valid: boolean;
  originalNode: ADNode | null;
}

export interface ParsedADDoc {
  version: 1;
  type: 'doc';
  content: ParsedADNode[];
}

export interface ADMark {
  type: string;
  attrs?: any;
}

export interface ADMarkSimple {
  type: {
    name: string;
  };
  attrs?: any;
}

/*
 * It's important that this order follows the marks rank defined here:
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-Rank
 */
export const markOrder = [
  'link',
  'em',
  'strong',
  'strike',
  'subsup',
  'underline',
  'code',
  'confluenceInlineComment',
];

export const isSubSupType = (type: string): type is 'sub' | 'sup' => {
  return type === 'sub' || type === 'sup';
};

/*
 * Sorts mark by the predefined order above
 */
export const getMarksByOrder = (marks: PMMark[]) => {
  return [...marks].sort(
    (a, b) => markOrder.indexOf(a.type.name) - markOrder.indexOf(b.type.name),
  );
};

/*
 * Check if two marks are the same by comparing type and attrs
 */
export const isSameMark = (mark: PMMark | null, otherMark: PMMark | null) => {
  if (!mark || !otherMark) {
    return false;
  }

  return mark.eq(otherMark);
};

/**
 * Validates an existing document-like structure, converting each node
 * to a valid version, storing whether or not the original node was valid/converted,
 * as well as the original node that was passed in.
 * @param doc The ADF-like document.
 * @param schema Schema to validate against.
 */
export const convertToValidatedDoc = (
  doc: ADDoc,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): ParsedADNode => {
  const node = validateNode(doc as ADNode, schema, adfStage);

  if (node.type === 'doc') {
    node.content = wrapInlineNodes(node.content);
    return node;
  }

  return node;
};

/**
 * Returns an ADNode tree representation from a validated ADF tree.
 * @param node the root of the tree
 * @param onlyValid return a tree with invalid nodes stripped out, such as fallback and unsupported nodes.
 */
export const getValidNode = (
  node: ParsedADNode,
  onlyValid: boolean = false,
): ADNode | null => {
  if (onlyValid && !node.valid) {
    return null;
  }

  const { type, attrs, marks, text, content: validatedContent } = node;

  const content: ADNode[] = [];
  if (validatedContent) {
    validatedContent.forEach(validatedChild => {
      const validChild = getValidNode(validatedChild, onlyValid);
      if (validChild) {
        content.push(validChild);
      }
    });
  }

  return {
    type,
    attrs,
    marks,
    text,
    content: validatedContent ? content : undefined,
  };
};

/**
 * Returns a valid ADDoc with valid children, if the root document was valid.
 */
export const getValidDocument = (doc: ParsedADNode): ADDoc | null => {
  if (!doc.valid) {
    return null;
  }

  const validNode = getValidNode(doc);
  if (
    !validNode ||
    validNode.type !== 'doc' ||
    typeof validNode.content === 'undefined'
  ) {
    return null;
  }

  return { type: 'doc', version: 1, content: validNode.content };
};

const wrapInlineNodes = (nodes: ParsedADNode[] = []): ParsedADNode[] => {
  return nodes.map(
    node =>
      inlineNodes.has(node.type)
        ? {
            type: 'paragraph',
            content: [node],
            valid: true,
            originalNode: null,
          }
        : node,
  );
};

export const getValidContent = (
  content: ADNode[],
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): ParsedADNode[] => {
  return content.map(node => validateNode(node, schema, adfStage));
};

const TEXT_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const RELATIVE_LINK = /^\//;

const flattenUnknownBlockTree = (
  node: ADNode,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): ParsedADNode[] => {
  const output: ParsedADNode[] = [];
  let isPrevLeafNode = false;

  for (let i = 0; i < node.content!.length; i++) {
    const childNode = node.content![i];
    const isLeafNode = !(childNode.content && childNode.content.length);

    if (i > 0) {
      if (isPrevLeafNode) {
        output.push({
          type: 'text',
          text: ' ',
          valid: true,
          originalNode: null,
        } as ParsedADNode);
      } else {
        output.push({
          type: 'hardBreak',
          valid: true,
          originalNode: null,
        } as ParsedADNode);
      }
    }

    if (isLeafNode) {
      output.push(validateNode(childNode, schema, adfStage));
    } else {
      output.push(...flattenUnknownBlockTree(childNode, schema, adfStage));
    }

    isPrevLeafNode = isLeafNode;
  }

  return output;
};

// null is Object, also maybe check obj.constructor == Object if we want to skip Class
const isValidObject = obj => obj !== null && typeof obj === 'object';
const isValidString = str => typeof str === 'string';
const keysLen = obj => Object.keys(obj).length;

const isValidIcon = icon =>
  isValidObject(icon) &&
  keysLen(icon) === 2 &&
  isValidString(icon.url) &&
  isValidString(icon.label);

const isValidUser = user => {
  const len = keysLen(user);
  return (
    isValidObject(user) &&
    len <= 2 &&
    isValidIcon(user.icon) &&
    (len === 1 || isValidString(user.id))
  );
};

/**
 * Sanitize unknown node tree
 *
 * @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-ImplementationdetailsforHCNGwebrenderer
 */
export const getValidUnknownNode = (
  node: ADNode,
  originalNode: ADNode,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): ParsedADNode => {
  const { attrs = {}, content, text, type } = node;

  if (!content || !content.length) {
    const unknownInlineNode: ParsedADNode = {
      type: 'text',
      text: text || attrs.text || `[${type}]`,
      valid: false,
      originalNode,
    };

    const { textUrl } = attrs;
    if (textUrl && isSafeUrl(textUrl)) {
      unknownInlineNode.marks = [
        {
          type: 'link',
          attrs: {
            href: textUrl,
          },
        } as ADMark,
      ];
    }

    return unknownInlineNode;
  }

  /*
   * Find leaf nodes and join them. If leaf nodes' parent node is the same node
   * join with a blank space, otherwise they are children of different branches, i.e.
   * we need to join them with a hardBreak node
   */
  return {
    type: 'unknownBlock',
    originalNode,
    valid: false,
    content: flattenUnknownBlockTree(originalNode, schema, adfStage),
  };
};

/*
 * This method will validate a Node according to the spec defined here
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-Nodes
 *
 * This is also the place to handle backwards compatibility.
 *
 * If a node is not recognized or is missing required attributes, we should return 'unknown'
 *
 */
export const validateNode = (
  originalNode: ADNode,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): ParsedADNode => {
  const { attrs, marks, text, type } = originalNode;

  const node: ParsedADNode = {
    attrs,
    marks,
    text,
    type,
    valid: false,
    originalNode,
  };

  let content;
  if (originalNode.content) {
    if (Array.isArray(originalNode.content)) {
      content = getValidContent(originalNode.content, schema, adfStage);
    }

    node.content = content;
  }

  // If node type doesn't exist in schema, make it an unknown node
  if (!schema.nodes[type]) {
    return getValidUnknownNode(node, originalNode, schema, adfStage);
  }

  if (type) {
    switch (type) {
      case 'applicationCard': {
        if (!attrs) {
          break;
        }
        const {
          text,
          link,
          background,
          preview,
          title,
          description,
          details,
          actions,
          context,
        } = attrs;
        if (!isValidString(text) || !isValidObject(title) || !title.text) {
          break;
        }

        // title can contain at most two keys (text, user)
        const titleKeys = Object.keys(title);
        if (titleKeys.length > 2) {
          break;
        }
        if (titleKeys.length === 2 && !title.user) {
          break;
        }
        if (title.user && !isValidUser(title.user)) {
          break;
        }

        if (
          (link && !link.url) ||
          (background && !background.url) ||
          (preview && !preview.url) ||
          (description && !description.text)
        ) {
          break;
        }

        if (context && !isValidString(context.text)) {
          break;
        }
        if (context && (context.icon && !isValidIcon(context.icon))) {
          break;
        }

        if (actions && !Array.isArray(actions)) {
          break;
        }
        if (actions && !actions.length) {
          break;
        }
        if (
          actions &&
          actions.some(meta => {
            const { key, title, target, parameters } = meta;
            if (key && !isValidString(key)) {
              return true;
            }
            if (!isValidString(title)) {
              return true;
            }
            if (!target) {
              return true;
            }
            if (!isValidString(target.key)) {
              return true;
            }
            if (target.receiver && !isValidString(target.receiver)) {
              return true;
            }
            if (parameters && !isValidObject(parameters)) {
              return true;
            }
          })
        ) {
          break;
        }

        if (details && !Array.isArray(details)) {
          break;
        }
        if (
          details &&
          details.some(meta => {
            const { badge, lozenge, users } = meta;
            if (badge && typeof badge.value !== 'number') {
              return true;
            }
            if (lozenge && !lozenge.text) {
              return true;
            }
            if (users && !Array.isArray(users)) {
              return true;
            }

            if (users && !users.every(isValidUser)) {
              return true;
            }
          })
        ) {
          break;
        }

        return {
          type,
          text,
          attrs,
          valid: true,
          originalNode,
        };
      }
      case 'doc': {
        const { version } = originalNode as ADDoc;
        if (version && content && content.length) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'codeBlock': {
        if (attrs && attrs.language) {
          return {
            type,
            attrs,
            content,
            valid: true,
            originalNode,
          };
        }
        return {
          type,
          content,
          valid: true,
          originalNode,
        };
      }
      case 'emoji': {
        if (attrs && attrs.shortName) {
          return {
            type,
            attrs,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'inlineExtension':
      case 'extension': {
        if (attrs && attrs.extensionType && attrs.extensionKey) {
          return {
            type,
            attrs,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'bodiedExtension': {
        if (attrs && attrs.extensionType && attrs.extensionKey && content) {
          return {
            type,
            attrs,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'hardBreak': {
        return {
          type,
          valid: true,
          originalNode,
        };
      }
      case 'media': {
        let mediaId = '';
        let mediaType = '';
        let mediaCollection = [];
        let mediaUrl = '';
        if (attrs) {
          const { id, collection, type, url } = attrs;
          mediaId = id;
          mediaType = type;
          mediaCollection = collection;
          mediaUrl = url;
        }

        if (mediaType === 'external' && !!mediaUrl) {
          return {
            type,
            attrs: {
              type: mediaType,
              url: mediaUrl,
              width: attrs.width,
              height: attrs.height,
            },
            valid: true,
            originalNode,
          };
        } else if (mediaId && mediaType) {
          const mediaAttrs: any = {
            type: mediaType,
            id: mediaId,
            collection: mediaCollection,
          };

          if (attrs.width) {
            mediaAttrs.width = attrs.width;
          }

          if (attrs.height) {
            mediaAttrs.height = attrs.height;
          }

          return {
            type,
            attrs: mediaAttrs,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'mediaGroup': {
        if (Array.isArray(content) && !content.some(e => e.type !== 'media')) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'mediaSingle': {
        if (
          Array.isArray(content) &&
          content.length === 1 &&
          content[0].type === 'media'
        ) {
          return {
            type,
            attrs,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'mention': {
        let mentionText = '';
        let mentionId;
        let mentionAccess;
        if (attrs) {
          const { text, displayName, id, accessLevel } = attrs;
          mentionText = text || displayName;
          mentionId = id;
          mentionAccess = accessLevel;
        }

        if (!mentionText) {
          mentionText = text || '@unknown';
        }

        if (mentionText && mentionId) {
          const mentionNode = {
            type,
            attrs: {
              id: mentionId,
              text: mentionText,
            },
            valid: true,
            originalNode,
          };
          if (mentionAccess) {
            mentionNode.attrs['accessLevel'] = mentionAccess;
          }

          return mentionNode;
        }
        break;
      }
      case 'paragraph': {
        return {
          type,
          content: content || [],
          valid: true,
          originalNode,
        };
      }
      case 'rule': {
        return {
          type,
          valid: true,
          originalNode,
        };
      }
      case 'text': {
        let { marks } = node;
        if (text) {
          if (marks) {
            marks = marks.reduce(
              (acc, mark) => {
                const validMark = getValidMark(mark, adfStage);
                // TODO: keep track of invalid marks
                if (validMark) {
                  acc.push(validMark);
                }

                return acc;
              },
              [] as ADMark[],
            );
          }
          return marks
            ? {
                type,
                text,
                marks: marks,
                valid: true,
                originalNode,
              }
            : {
                type,
                text,
                valid: true,
                originalNode,
              };
        }
        break;
      }
      case 'heading': {
        if (attrs && content) {
          const { level } = attrs;
          const between = (x, a, b) => x >= a && x <= b;
          if (level && between(level, 1, 6)) {
            return {
              type,
              content,
              attrs: {
                level,
              },
              valid: true,
              originalNode,
            };
          }
        }
        break;
      }
      case 'bulletList': {
        if (content) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'orderedList': {
        if (content) {
          return {
            type,
            content,
            attrs: {
              order: attrs && attrs.order,
            },
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'listItem': {
        if (content) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'blockquote': {
        if (content) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'panel': {
        const types = ['info', 'note', 'tip', 'success', 'warning', 'error'];
        if (attrs && content) {
          const { panelType } = attrs;
          if (types.indexOf(panelType) > -1) {
            return {
              type,
              attrs: { panelType },
              content,
              valid: true,
              originalNode,
            };
          }
        }
        break;
      }
      case 'decisionList': {
        return {
          type,
          content,
          attrs: {
            localId: (attrs && attrs.localId) || uuid(),
          },
          valid: true,
          originalNode,
        };
      }
      case 'decisionItem': {
        return {
          type,
          content,
          attrs: {
            localId: (attrs && attrs.localId) || uuid(),
            state: (attrs && attrs.state) || 'DECIDED',
          },
          valid: true,
          originalNode,
        };
      }
      case 'taskList': {
        return {
          type,
          content,
          attrs: {
            localId: (attrs && attrs.localId) || uuid(),
          },
          valid: true,
          originalNode,
        };
      }
      case 'taskItem': {
        return {
          type,
          content,
          attrs: {
            localId: (attrs && attrs.localId) || uuid(),
            state: (attrs && attrs.state) || 'TODO',
          },
          valid: true,
          originalNode,
        };
      }
      case 'table': {
        if (
          Array.isArray(content) &&
          content.length > 0 &&
          !content.some(e => e.type !== 'tableRow')
        ) {
          return {
            type,
            content,
            attrs,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'tableRow': {
        if (
          Array.isArray(content) &&
          content.length > 0 &&
          !content.some(e => e.type !== 'tableCell' && e.type !== 'tableHeader')
        ) {
          return {
            type,
            content,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'tableCell':
      case 'tableHeader': {
        if (content) {
          const cellAttrs: CellAttributes = {};

          if (attrs) {
            if (attrs.colspan && attrs.colspan > 1) {
              cellAttrs.colspan = attrs.colspan;
            }

            if (attrs.rowspan && attrs.rowspan > 1) {
              cellAttrs.rowspan = attrs.rowspan;
            }

            if (attrs.background) {
              cellAttrs.background = attrs.background;
            }

            if (attrs.colwidth && Array.isArray(attrs.colwidth)) {
              cellAttrs.colwidth = attrs.colwidth;
            }
          }

          return {
            type,
            content,
            attrs: attrs ? cellAttrs : undefined,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'image': {
        if (attrs && attrs.src) {
          return {
            type,
            attrs,
            valid: true,
            originalNode,
          };
        }
        break;
      }
      case 'placeholder': {
        if (attrs && typeof attrs.text !== 'undefined') {
          return { type, attrs, valid: true, originalNode };
        }

        break;
      }
    }
  }

  return getValidUnknownNode(node, originalNode, schema, adfStage);
};

/*
 * This method will validate a Mark according to the spec defined here
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/11174043/Document+structure#Documentstructure-Marks
 *
 * This is also the place to handle backwards compatibility.
 *
 * If a node is not recognized or is missing required attributes, we should return null
 *
 */
export const getValidMark = (
  mark: ADMark,
  adfStage: ADFStage = 'final',
): ADMark | null => {
  const { attrs, type } = mark;

  if (type) {
    switch (type) {
      case 'action': {
        if (attrs && attrs.target && attrs.target.key) {
          return {
            type,
            attrs,
          };
        }
        break;
      }
      case 'code': {
        return {
          type,
        };
      }
      case 'em': {
        return {
          type,
        };
      }
      case 'link': {
        if (attrs) {
          const { href, url, __confluenceMetadata } = attrs;
          let linkHref = href || url;

          if (
            linkHref &&
            linkHref.indexOf(':') === -1 &&
            !RELATIVE_LINK.test(linkHref)
          ) {
            linkHref = `http://${linkHref}`;
          }

          const linkAttrs: any = {
            href: linkHref,
          };

          if (__confluenceMetadata) {
            linkAttrs.__confluenceMetadata = __confluenceMetadata;
          }

          if (linkHref && isSafeUrl(linkHref)) {
            return {
              type,
              attrs: linkAttrs,
            };
          }
        }
        break;
      }
      case 'strike': {
        return {
          type,
        };
      }
      case 'strong': {
        return {
          type,
        };
      }
      case 'subsup': {
        if (attrs && attrs['type']) {
          const subSupType = attrs['type'];
          if (isSubSupType(subSupType)) {
            return {
              type,
              attrs: {
                type: subSupType,
              },
            };
          }
        }
        break;
      }
      case 'textColor': {
        if (attrs && TEXT_COLOR_PATTERN.test(attrs.color)) {
          return {
            type,
            attrs,
          };
        }

        break;
      }
      case 'underline': {
        return {
          type,
        };
      }
    }
  }

  if (adfStage === 'stage0') {
    switch (type) {
      case 'confluenceInlineComment': {
        return {
          type,
          attrs,
        };
      }
    }
  }

  return null;
};
