import { Node } from 'prosemirror-model';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}
