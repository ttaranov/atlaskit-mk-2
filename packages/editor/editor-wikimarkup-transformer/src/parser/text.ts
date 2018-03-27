import * as assert from 'assert';
import { Mark, Node as PMNode, Schema } from 'prosemirror-model';

import {
  EmojiClosestMatch,
  MatchPosition,
  TextMarkElement,
  TextMatch,
  Effect,
} from '../interfaces';
import { getEditorColor } from './color';
import { findMacros } from './macros';
import { EMOJIS } from './emoji';

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

function findFirstEmoji(
  text: string,
  position: number,
): EmojiClosestMatch | null {
  return EMOJIS.reduce((memo: EmojiClosestMatch | null, emoji, index) => {
    const { markup } = emoji;
    const matchPosition = text.indexOf(markup, position);

    if (matchPosition === -1) {
      return memo;
    }

    return memo && memo.matchPosition < matchPosition
      ? memo
      : { emoji, matchPosition };
  }, null);
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
export function findTextAndEmoji(
  schema: Schema,
  text: string,
  effects: Effect[],
): PMNode[] {
  const output: PMNode[] = [];
  let position = 0;

  while (position < text.length) {
    const closestEmoji = findFirstEmoji(text, position);
    const marks = effectsToMarks(schema, effects);

    if (!closestEmoji) {
      const textChunk = text.substr(position);
      const textNode = schema.text(textChunk, marks);
      output.push(textNode);

      break;
    }

    const { emoji, matchPosition } = closestEmoji;
    const textChunk = text.substring(position, matchPosition);

    if (textChunk.length) {
      const textNode = schema.text(textChunk, marks);
      output.push(textNode);
    }

    const emojiNode = schema.nodes.emoji.createChecked(emoji.adf);
    output.push(emojiNode);

    // start next search from current position + found emoji string length
    position = matchPosition + emoji.markup.length;
  }

  return output;
}

/**
 * Create a new list of marks from effects
 */
export function effectsToMarks(schema: Schema, effects: Effect[]): Mark[] {
  const {
    code,
    em,
    strike,
    strong,
    subsup,
    textColor,
    underline,
  } = schema.marks;

  const marks = effects.map(({ name, attrs }) => {
    switch (name) {
      case 'color':
        return textColor.create(attrs);

      case 'emphasis':
      case 'citation':
        return em.create();

      case 'deleted':
        return strike.create();

      case 'strong':
        return strong.create();

      case 'inserted':
        return underline.create();
      case 'superscript':
        return subsup.create({ type: 'sup' });
      case 'subscript':
        return subsup.create({ type: 'sub' });
      case 'monospaced':
        return code.create();

      default:
        throw new Error(`Unknown effect: ${name}`);
    }
  });

  // some marks cannot be used together with others
  // for instance "code" cannot be used with "bold" or "textColor"
  // addToSet() takes care of these rules
  return marks.length ? marks[0].addToSet(marks.slice(1)) : [];
}
