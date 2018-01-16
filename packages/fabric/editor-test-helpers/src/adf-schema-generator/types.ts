export interface StringNode {
  type: 'string';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface BooleanNode {
  type: 'boolean';
}

export interface NumberNode {
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export interface ArrayNode {
  type: 'array';
  minItems?: number;
  maxItems?: number;
  items: SchemaNode;
}

export interface ObjectNode {
  type: 'object';
  properties: { [key: string]: SchemaNode } & { type: EnumNode };
  required: string[];
}

export type TypedNode =
  | StringNode
  | BooleanNode
  | NumberNode
  | ArrayNode
  | ObjectNode;

export interface EnumNode {
  enum: any[];
}

export interface AnyOfNode {
  anyOf: SchemaNode[];
}

export interface AllOfNode {
  allOf: SchemaNode[];
}

export interface EmptyNode {}

export type SchemaNode =
  | TypedNode
  | EnumNode
  | AnyOfNode
  | AllOfNode
  | EmptyNode;

export const isTypedNode = (node: SchemaNode): node is TypedNode =>
  (<TypedNode>node).type !== undefined;
export const isAnyOfNode = (node: SchemaNode): node is AnyOfNode =>
  (<AnyOfNode>node).anyOf !== undefined;
export const isEnumNode = (node: SchemaNode): node is EnumNode =>
  (<EnumNode>node).enum !== undefined;
export const isAllOfNode = (node: SchemaNode): node is AllOfNode =>
  (<AllOfNode>node).allOf !== undefined;
