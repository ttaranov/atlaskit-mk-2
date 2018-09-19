import {
  codeBlockToJSON,
  defaultSchema,
  linkToJSON,
  mediaToJSON,
  mediaSingleToJSON,
  mentionToJSON,
  tableToJSON,
  toJSONTableCell,
  toJSONTableHeader,
  Transformer,
} from '@atlaskit/editor-common';
import { Node as PMNode, Mark as PMMark } from 'prosemirror-model';

export type JSONNode = {
  type: string;
  attrs?: object;
  content?: JSONNode[];
  marks?: any[];
  text?: string;
};

export type JSONDocNode = {
  version: number;
  type: 'doc';
  content: JSONNode[];
};

const isCodeBlock = (node: PMNode) => node.type.name === 'codeBlock';
const isMediaNode = (node: PMNode) => node.type.name === 'media';
const isMediaSingleNode = (node: PMNode) => node.type.name === 'mediaSingle';
const isMentionNode = (node: PMNode) => node.type.name === 'mention';
const isParagraph = (node: PMNode) => node.type.name === 'paragraph';
const isHeading = (node: PMNode) => node.type.name === 'heading';
const isTable = (node: PMNode) => node.type.name === 'table';
const isTableCell = (node: PMNode) => node.type.name === 'tableCell';
const isTableHeader = (node: PMNode) => node.type.name === 'tableHeader';
const isLinkMark = (mark: PMMark) => mark.type.name === 'link';

const filterNull = subject => {
  return Object.keys(subject).reduce((acc, key) => {
    let current = subject[key];

    if (current === null) {
      return acc;
    }

    if (typeof current === 'object' && !Array.isArray(current)) {
      current = filterNull(current);
    }

    return { ...acc, [key]: current };
  }, {});
};

const toJSON = (node: PMNode): JSONNode => {
  const obj: JSONNode = { type: node.type.name };
  if (isMediaNode(node)) {
    obj.attrs = mediaToJSON(node).attrs;
  } else if (isMediaSingleNode(node)) {
    obj.attrs = mediaSingleToJSON(node).attrs;
  } else if (isMentionNode(node)) {
    obj.attrs = mentionToJSON(node).attrs;
  } else if (isCodeBlock(node)) {
    obj.attrs = codeBlockToJSON(node).attrs;
  } else if (isTable(node)) {
    obj.attrs = tableToJSON(node).attrs;
  } else if (isTableCell(node)) {
    obj.attrs = toJSONTableCell(node).attrs;
  } else if (isTableHeader(node)) {
    obj.attrs = toJSONTableHeader(node).attrs;
  } else if (Object.keys(node.attrs).length) {
    obj.attrs = node.attrs;
  }

  if (obj.attrs) {
    obj.attrs = filterNull(obj.attrs);
  }

  if (node.isText) {
    obj.text = node.textContent;
  } else {
    node.content.forEach((child: PMNode) => {
      obj.content = obj.content || [];
      obj.content.push(toJSON(child));
    });
  }

  if (isParagraph(node) || isHeading(node)) {
    obj.content = obj.content || [];
  }

  if (node.marks.length) {
    obj.marks = node.marks.map(n => {
      if (isLinkMark(n)) {
        return linkToJSON(n);
      }
      return n.toJSON();
    });
  }
  return obj;
};

export class JSONTransformer implements Transformer<JSONDocNode> {
  encode(node: PMNode): JSONDocNode {
    const content: JSONNode[] = [];

    node.content.forEach(child => {
      content.push(toJSON(child));
    });

    return {
      version: 1,
      type: 'doc',
      content,
    };
  }

  parse(content: JSONDocNode): PMNode {
    if (content.type !== 'doc') {
      throw new Error('Expected content format to be ADF');
    }
    const doc = defaultSchema.nodeFromJSON(content);
    doc.check();
    return doc;
  }
}
