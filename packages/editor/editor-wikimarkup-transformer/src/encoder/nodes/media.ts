import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

export const media: NodeEncoder = (node: PMNode): string => {
  let wikiAttrs: string[] = [];
  if (node.attrs.width) {
    wikiAttrs.push(`width=${node.attrs.width}`);
  }
  if (node.attrs.height) {
    wikiAttrs.push(`height=${node.attrs.height}`);
  }
  if (wikiAttrs.length) {
    return `!${node.attrs.id}|${wikiAttrs.join(',')}!`;
  }
  // default to thumbnail if no width or height is set
  return `!${node.attrs.id}|thumbnail!`;
};
