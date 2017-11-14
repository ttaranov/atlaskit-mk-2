import {
  Node as PMNode,
  Schema
} from 'prosemirror-model';
import { Transformer } from '../transformer';
import parse from './parse';
import encode from './encode';
export { LANGUAGE_MAP } from './languageMap';

export default class ConfluenceTransformer implements Transformer<string> {
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  parse = (html: string): PMNode => parse(html, this.schema);

  encode = (node: PMNode): string => encode(node, this.schema);
}
