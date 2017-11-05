import { bitbucketSchema } from '@atlaskit/editor-common';
import {
  DOMParser,
  Node as PMNode,
  Schema,
} from 'prosemirror-model';
import {
  MarkdownSerializer,
  marks,
  nodes,
} from './serializer';
import { Transformer } from '../transformer';
import { transformHtml } from './util';

export default class BitbucketTransformer implements Transformer<string> {
  private serializer = new MarkdownSerializer(nodes, marks);
  private schema: Schema;

  constructor(schema: Schema = bitbucketSchema) {
    this.schema = schema;
  }

  encode(node: PMNode): string {
    return this.serializer.serialize(node);
  }

  parse(html: string): PMNode {
    const dom = this.buildDOMTree(html);
    return DOMParser.fromSchema(this.schema).parse(dom);
  }

  buildDOMTree(html: string): HTMLElement {
    return transformHtml(html);
  }
}
