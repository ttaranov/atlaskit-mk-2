import * as assert from 'assert';

import { MatchPosition, TextEffect, TextMatch } from '../interfaces';
import { getEditorColor } from './color';
import { findMacros } from './macros';

interface TextMarkElement {
  name: TextEffect;
  grep: string;
}

const SIMPLE_TEXT_MARKS: TextMarkElement[] = [
  { name: 'strong', grep: '*' },
  { name: 'emphasis', grep: '_' },
  { name: 'citation', grep: '??' },
  { name: 'deleted', grep: '-' },
  { name: 'inserted', grep: '+' },
  { name: 'superscript', grep: '^' },
  { name: 'subscript', grep: '~' },

  // { name: 'link', grep: '*' },
];

function findMonospaceMatches(text: string): TextMatch[] {
  const output: TextMatch[] = [];

  // search for {{monospace text}}
  const regex = /\{\{(.+?)\}\}/g;
  let matches: RegExpExecArray | null;

  while ((matches = regex.exec(text)) !== null) {
    const position = matches.index;

    output.push({
      effect: 'monospaced',
      attrs: {},
      startPos: {
        outer: position,
        inner: position + 2,
      },
      endPos: {
        inner: position + 2 + matches[1].length,
        outer: position + 4 + matches[1].length,
      },
    });
  }

  return output;
}

/**
 * Search for text effects in the string
 */
export function findTextMatches(text: string): TextMatch[] {
  assert(!text.includes('\n'), 'Text chunks should be split by new lines');
  const output: TextMatch[] = [];

  for (const { name, grep } of SIMPLE_TEXT_MARKS) {
    let fromIndex = 0;
    let matchCount = 0;
    let matchIndex: number | undefined;
    let startPos: MatchPosition | undefined;

    while ((matchIndex = text.indexOf(grep, fromIndex)) !== -1) {
      const isOpening = matchCount % 2 === 0;

      if (isOpening) {
        startPos = {
          outer: matchIndex,
          inner: matchIndex + grep.length,
        };
      } else {
        output.push({
          effect: name,
          attrs: {},
          startPos: startPos!,
          endPos: {
            inner: matchIndex,
            outer: matchIndex + grep.length,
          },
        });
      }

      matchCount++;
      fromIndex = matchIndex + 1;
    }
  }

  // color is a special "inline" macros
  const colorMatches = findMacros(text, ['color']);

  for (const { attrs, startPos, endPos } of colorMatches) {
    output.push({
      effect: 'color',
      attrs: {
        color: getEditorColor(attrs),
      },
      startPos,
      endPos,
    });
  }

  // monospace is a special regex
  const monospaceMatches = findMonospaceMatches(text);
  output.push(...monospaceMatches);

  return output;
}
