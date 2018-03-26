import { Fragment, Schema } from 'prosemirror-model';

import { Serializer } from '../serializer';
import { defaultSchema } from '@atlaskit/editor-common';
import { reduceTree } from './utils';
import { ReducedNode } from './nodes';

const serializeTree = (node: ReducedNode): string => {
  if (node.content) {
    return node.content!
      .reduce((arr: string[], childNode) => {
        if (!childNode.text && !childNode.content) {
          return arr;
        }
        arr.push((node.text || '') + serializeTree(childNode));
        return arr;
      }, [])
      .join('\n');
  }

  return node.text!;
};

export default class TextSerializer implements Serializer<string> {
  constructor(private schema: Schema) {
    this.schema = schema;
  }

  serializeFragment(fragment: Fragment): string {
    const tree: ReducedNode = { content: reduceTree(fragment, this.schema) };
    return serializeTree(tree);
  }

  static fromSchema(schema: Schema = defaultSchema): TextSerializer {
    return new TextSerializer(schema);
  }
}
