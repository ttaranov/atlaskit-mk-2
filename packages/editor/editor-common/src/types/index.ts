import { Node } from 'prosemirror-model';
export * from './extension-handler';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}
