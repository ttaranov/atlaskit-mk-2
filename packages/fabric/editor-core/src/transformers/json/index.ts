import {
  defaultSchema,
  mediaToJSON,
  mentionToJSON,
} from '@atlaskit/editor-common';
import { Node as PMNode } from 'prosemirror-model';
import { Transformer } from '../transformer';

export type JSONNode = {
  type: string,
  attrs?: object,
  content?: JSONNode[],
  marks?: any[],
  text?: string,
};

export type JSONDocNode = {
  version: number,
  type: 'doc',
  content: JSONNode[],
};

const isMediaNode = (node: PMNode) => node.type.name === 'media';
const isMentionNode = (node: PMNode) => node.type.name === 'mention';
const isParagraph = (node: PMNode) => node.type.name === 'paragraph';

const toJSON = (node: PMNode) : JSONNode => {
  const obj: JSONNode = { type: node.type.name };

  if (isMediaNode(node)) {
    obj.attrs = mediaToJSON(node).attrs;
  } else if (isMentionNode(node)) {
    obj.attrs = mentionToJSON(node).attrs;
  } else if (Object.keys(node.attrs).length) {
    obj.attrs = node.attrs;
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

export default class JSONTransformer implements Transformer<JSONDocNode> {
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
    return defaultSchema.nodes.doc.create();
  }
}
