import {
  Fragment,
  Schema,
  Node as PMNode,
  DOMSerializer,
  DOMParser,
} from 'prosemirror-model';

export const fromHTML = (html: string, schema: Schema): PMNode => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return DOMParser.fromSchema(schema).parse(el);
};

export const toDOM = (node: PMNode, schema: Schema): Node => {
  const serializer = DOMSerializer.fromSchema(schema);
  return serializer.serializeFragment(Fragment.from(node));
};

export const toHTML = (node: PMNode, schema: Schema): string => {
  const el = document.createElement('div');
  el.appendChild(toDOM(node, schema));
  return el.innerHTML;
};
