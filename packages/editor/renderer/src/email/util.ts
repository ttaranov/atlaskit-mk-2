import { Mark } from 'prosemirror-model';
import { Style } from './interfaces';
import { markSerializers } from './serializers';

export const createTag = (
  tagName: string,
  attrs?: { [key: string]: string | number | undefined },
  content?: string | null,
) => {
  const attrsList: string[] = [];

  Object.keys(attrs || {}).forEach(key => {
    const value = attrs![key];

    if (value === undefined) {
      return;
    }

    attrsList.push(`${key}="${String(value).replace(/"/g, '"')}"`);
  });

  const attrsSerialized = attrsList.length ? ` ${attrsList.join(' ')}` : '';

  return content
    ? `<${tagName}${attrsSerialized}>${content}</${tagName}>`
    : `<${tagName}${attrsSerialized}/>`;
};

export const serializeStyle = (style: Style): string => {
  return Object.keys(style).reduce((memo, key) => {
    if (style[key] === undefined) {
      return memo;
    }

    const value = String(style[key]).replace(/"/g, '"');
    return (memo += `${key}: ${value};`);
  }, '');
};

export const applyMarks = (marks: Mark[], text: string): string => {
  let output = text;

  for (const mark of marks) {
    // ignore marks with unknown type
    if (markSerializers[mark.type.name]) {
      output = markSerializers[mark.type.name]({ mark, text: output });
    }
  }

  return output;
};
