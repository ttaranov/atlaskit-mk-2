import { SchemaNode } from './types';

export type StackAction =
  | {
      type: 'ASSIGN';
      ancestor: object;
      property: string;
      node: SchemaNode;
    }
  | {
      type: 'MERGE';
      accumulator: object;
      node: SchemaNode;
    };

export class Stack {
  _stack: StackAction[];

  constructor() {
    this._stack = [];
  }

  push(action: StackAction) {
    this._stack.push(action);
  }

  pop() {
    return this._stack.pop();
  }

  isEmpty() {
    return !this._stack.length;
  }
}
