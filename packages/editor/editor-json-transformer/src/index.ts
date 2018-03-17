import {
  codeBlockToJSON,
  defaultSchema,
  mediaToJSON,
  mentionToJSON,
  toJSONTableCell,
  toJSONTableHeader,
  Transformer,
} from '@atlaskit/editor-common';
import { Node as PMNode } from 'prosemirror-model';

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
const isMentionNode = (node: PMNode) => node.type.name === 'mention';
const isParagraph = (node: PMNode) => node.type.name === 'paragraph';
const isTableCell = (node: PMNode) => node.type.name === 'tableCell';
const isTableHeader = (node: PMNode) => node.type.name === 'tableHeader';

const toJSON = (node: PMNode): JSONNode => {
  const obj: JSONNode = { type: node.type.name };
  let attrs;
  if (isMediaNode(node)) {
    attrs = mediaToJSON(node).attrs;
  } else if (isMentionNode(node)) {
    attrs = mentionToJSON(node).attrs;
  } else if (isCodeBlock(node)) {
    attrs = codeBlockToJSON(node).attrs;
  } else if (isTableCell(node)) {
    attrs = toJSONTableCell(node).attrs;
  } else if (isTableHeader(node)) {
    attrs = toJSONTableHeader(node).attrs;
  } else if (Object.keys(node.attrs).length) {
    attrs = {};
    for (let key in node.attrs) {
      if (node.attrs[key] !== null && node.attrs[key] !== undefined) {
        attrs[key] = node.attrs[key];
      }
    }
  }
  if (attrs && Object.keys(attrs).length > 0) {
    obj.attrs = attrs;
  }

  if (node.isText) {
    obj.text = node.textContent;
  } else {
    node.content.forEach((child: PMNode) => {
      obj.content = obj.content || [];
      obj.content.push(toJSON(child));
    });
  }

  if (isParagraph(node)) {
    // Paragraph shall always has a content
    obj.content = obj.content || [];
  }

  if (node.marks.length) {
    obj.marks = node.marks.map(n => n.toJSON());
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
