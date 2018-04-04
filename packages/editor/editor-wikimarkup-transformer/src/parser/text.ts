import * as assert from 'assert';
import { Node as PMNode, Schema } from 'prosemirror-model';

import {
  Effect,
  InlineNodeClosestMatch,
  InlineNodeWithPosition,
  MatchPosition,
  TextInterval,
  TextMarkElement,
  TextMatch,
} from '../interfaces';
import { getEditorColor } from './color';
import { findMacros } from './macros';
import { EMOJIS } from './emoji';
import { effectsToMarks } from './marks';
import { calcTextIntervals, containsInterval } from './intervals';

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

// [~username] and other mentions
const MENTION_REGEXP = /\[~([\w]+?)\]/;

const DOUBLE_BACKSLASH = '\\\\';

function findMonospaceMatches(text: string): TextMatch[] {
  const output: TextMatch[] = [];

  // search for {{monospace text}}
  const regex = /\{\{(.+?)\}\}/g;
  let matches: RegExpExecArray | null;

  while ((matches = regex.exec(text)) !== null) {
    const position = matches.index;

    if (position > 0 && text[position - 1] === '\\') {
      continue;
    }

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

function findFirstEmoji(
  schema: Schema,
  text: string,
  position: number,
): InlineNodeClosestMatch | null {
  let output: InlineNodeClosestMatch | null = null;

  for (const emoji of EMOJIS) {
    const { markup } = emoji;
    const [match, matchPosition] = findFirstPosition(text, markup, position);

    // this emoji doesn't exist in a string
    if (matchPosition === -1) {
      continue;
    }

    if (!output || matchPosition < output.matchPosition) {
      output = {
        matchPosition,
        nodeType: schema.nodes.emoji,
        attrs: emoji.adf,
        textLength: match.length,
      };
    }
  }

  return output;
}

function findFirstMention(
  schema: Schema,
  text: string,
  position: number,
): InlineNodeClosestMatch | null {
  const matches = text.substr(position).match(MENTION_REGEXP);

  if (matches) {
    const { index } = matches;
    const username = matches[1];

    return {
      nodeType: schema.nodes.mention,
      attrs: { id: username, text: username },
      matchPosition: (index || 0) + position,
      textLength: matches[0].length,
    };
  }

  return null;
}

function findFirstInlineNode(
  schema: Schema,
  text: string,
  position: number,
): InlineNodeWithPosition | null {
  // get all possible closest inline nodes
  // and sort them by matching position (where they begin)
  const closestInlineNodes = [
    findFirstEmoji(schema, text, position),
    findFirstMention(schema, text, position),
  ]
    .filter(Boolean)
    .sort((a, b) => a!.matchPosition - b!.matchPosition);

  if (closestInlineNodes.length) {
    const {
      nodeType,
      attrs,
      matchPosition,
      textLength,
    } = closestInlineNodes.shift() as InlineNodeClosestMatch;

    return {
      matchPosition,
      textLength,
      node: nodeType.createChecked(attrs),
    };
  }

  return null;
}

/**
 * Find the first position in the passed text matching anything from the passed array
 * @param {string} text
 * @param {string[]} searches
 * @param {number?} start - start index
 * @returns {Array} [ match, matchPosition ]
 */
function findFirstPosition(
  text: string,
  searches: string[],
  start = 0,
): Array<string | null, number> {
  for (const search of searches) {
    const match = text.indexOf(search, start);

    if (match !== -1) {
      return [search, match];
    }
  }

  return [null, -1];
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

/**
 * Take piece of text, find emojis in it and return list of emoji/text nodes
 */
export function findTextAndInlineNodes(
  schema: Schema,
  text: string,
  effects: Effect[],
): PMNode[] {
  const output: PMNode[] = [];
  let position = 0;

  while (position < text.length) {
    const closestInlineNode = findFirstInlineNode(schema, text, position);
    const marks = effectsToMarks(schema, effects);

    if (!closestInlineNode) {
      const textChunk = text.substr(position);
      const textNode = schema.text(textChunk, marks);
      output.push(textNode);

      break;
    }

    const { node, matchPosition, textLength } = closestInlineNode;
    const textChunk = text.substring(position, matchPosition);

    if (textChunk.length) {
      const textNode = schema.text(textChunk, marks);
      output.push(textNode);
    }

    // this is the inline node (mention, emoji, etc)
    output.push(node);

    // start next search from current position + found emoji string length
    position = matchPosition + textLength;
  }

  return output;
}

/**
 * Splits the string into intervals of text with text effects
 */
export function getResolvedTextIntervals(text: string): TextInterval[] {
  const matches = findTextMatches(text);

  // calculate all intervals taking outer borders of macros
  const intervals = calcTextIntervals(text, matches);

  // create output list with empty macros in its elements
  const output: TextInterval[] = intervals.map(({ left, right }) => {
    return {
      effects: [],
      text: text.substring(left, right),
    };
  });

  // iterate existing macros and put them into the output list
  for (const match of matches) {
    intervals.map((interval, i) => {
      if (containsInterval(match, interval)) {
        output[i].effects.push({
          name: match.effect,
          attrs: match.attrs,
        });
      }
    });
  }

  return output;
}

export function getTextWithMarks(
  schema: Schema,
  text: string,
  extraEffects: Effect[] = [],
): PMNode[] {
  const intervals = getResolvedTextIntervals(text);
  const output: PMNode[] = [];

  for (const { effects, text } of intervals) {
    const textWithLineBreaks = text.split(DOUBLE_BACKSLASH);
    const textEffects = effects.concat(extraEffects);

    textWithLineBreaks.forEach((chunk, i) => {
      const inlineNodes = findTextAndInlineNodes(schema, chunk, textEffects);
      output.push(...inlineNodes);

      if (i + 1 < textWithLineBreaks.length) {
        const hardBreakNode = schema.nodes.hardBreak.createChecked();
        output.push(hardBreakNode);
      }
    });
  }

  return output;
}
