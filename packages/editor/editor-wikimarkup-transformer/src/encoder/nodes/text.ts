import { Node as PMNode } from 'prosemirror-model';
import { NodeEncoder } from '..';

import { code } from '../marks/code';
import { textColor } from '../marks/color';
import { em } from '../marks/em';
import { link } from '../marks/link';
import { strike } from '../marks/strike';
import { strong } from '../marks/strong';
import { subsup } from '../marks/subsup';
import { underline } from '../marks/underline';

/**
 * The order of the mapping matters.
 * For example, textColor will be a macro {color} so
 * we want to process other marks before it.
 */
const markEncoderMapping = new Map([
  ['em', em],
  ['strike', strike],
  ['strong', strong],
  ['subsup', subsup],
  ['underline', underline],
  ['textColor', textColor],
  ['link', link],
  ['code', code],
]);

export const text: NodeEncoder = (node: PMNode, parent?: PMNode): string => {
  let result =
    parent && parent.type.name === 'codeBlock'
      ? node.text!
      : escapingWikiFormatter(node.text!);
  markEncoderMapping.forEach((encoder, markName) => {
    const mark = node.marks.find(m => m.type.name === markName);
    if (mark) {
      result = encoder(result, mark.attrs);
    }
  });

  return result;
};

function escapingWikiFormatter(text: string) {
  return text.replace(/[{\\![]/g, '\\$&');
}
