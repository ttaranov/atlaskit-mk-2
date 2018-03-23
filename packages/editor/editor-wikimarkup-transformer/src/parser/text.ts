import * as assert from 'assert';

import { MatchPosition, TextEffect, TextMatch } from '../interfaces';

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

  // { name: 'color', grep: '*' },
  // { name: 'monospaced', grep: '*' },
  // { name: 'link', grep: '*' },
];

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

  return output;
}
