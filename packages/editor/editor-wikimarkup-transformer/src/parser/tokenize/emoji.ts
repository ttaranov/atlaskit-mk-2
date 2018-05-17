import { Schema } from 'prosemirror-model';
import { Token } from './';

export interface EmojiMapItem {
  markup: string[];
  adf: {
    id: string;
    shortName: string;
    text: string;
  };
}

export function emoji(input: string, schema: Schema): Token {
  // Look for a emoji
  for (const emo of EMOJIS) {
    for (const text of emo.markup) {
      if (input.startsWith(text)) {
        return {
          type: 'pmnode',
          nodes: [schema.nodes.emoji.createChecked(emo.adf)],
          length: text.length,
        };
      }
    }
  }
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}

export const EMOJIS: EmojiMapItem[] = [
  {
    markup: [':)', ':-)'],
    adf: {
      id: '1f642',
      shortName: ':slight_smile:',
      text: '🙂',
    },
  },
  {
    markup: [':(', ':-('],
    adf: {
      id: '1f61e',
      shortName: ':disappointed:',
      text: '😞',
    },
  },
  {
    markup: [':P', ':-P', ':p', ':-p'],
    adf: {
      id: '1f61b',
      shortName: ':stuck_out_tongue:',
      text: '😛',
    },
  },
  {
    markup: [':D', ':-D'],
    adf: {
      id: '1f603',
      shortName: ':smiley:',
      text: '😃',
    },
  },
  {
    markup: [';)', ';-)'],
    adf: {
      id: '1f609',
      shortName: ':wink:',
      text: '😉',
    },
  },
  {
    markup: ['(y)'],
    adf: {
      id: '1f44d',
      shortName: ':thumbsup:',
      text: '👍',
    },
  },
  {
    markup: ['(n)'],
    adf: {
      id: '1f44e',
      shortName: ':thumbsdown:',
      text: '👎',
    },
  },
  {
    markup: ['(i)'],
    adf: {
      id: '2139',
      shortName: ':information_source:',
      text: 'ℹ️',
    },
  },
  {
    markup: ['(/)'],
    adf: {
      id: '2705',
      shortName: ':white_check_mark:',
      text: '✅',
    },
  },
  {
    markup: ['(x)'],
    adf: {
      id: '274e',
      shortName: ':negative_squared_cross_mark:',
      text: '❎',
    },
  },
  {
    markup: ['(!)'],
    adf: {
      id: '26a0',
      shortName: ':warning:',
      text: '⚠️',
    },
  },
  {
    markup: ['(+)'],
    adf: {
      id: '2795',
      shortName: ':heavy_plus_sign:',
      text: '➕',
    },
  },
  {
    markup: ['(-)'],
    adf: {
      id: '2796',
      shortName: ':heavy_minus_sign:',
      text: '➖',
    },
  },
  {
    markup: ['(?)'],
    adf: {
      id: '2753',
      shortName: ':question:',
      text: '❓',
    },
  },
  {
    markup: ['(on)'],
    adf: {
      id: '1f4a1',
      shortName: ':bulb:',
      text: '💡',
    },
  },
  {
    markup: ['(off)'],
    adf: {
      id: '26d4',
      shortName: ':no_entry:',
      text: '⛔',
    },
  },
  {
    markup: ['(*)'],
    adf: {
      id: '1f49b',
      shortName: ':yellow_heart:',
      text: '💛',
    },
  },
  {
    markup: ['(*r)'],
    adf: {
      id: '2764',
      shortName: ':heart:',
      text: '❤️',
    },
  },
  {
    markup: ['(*g)'],
    adf: {
      id: '1f49a',
      shortName: ':green_heart:',
      text: '💚',
    },
  },
  {
    markup: ['(*b)'],
    adf: {
      id: '1f499',
      shortName: ':blue_heart:',
      text: '💙',
    },
  },
  {
    markup: ['(*y)'],
    adf: {
      id: '1f49b',
      shortName: ':yellow_heart:',
      text: '💛',
    },
  },
  {
    markup: ['(flag)'],
    adf: {
      id: '1f6a9',
      shortName: ':triangular_flag_on_post:',
      text: '🚩',
    },
  },
  {
    markup: ['(flagoff)'],
    adf: {
      id: '1f3f3',
      shortName: ':flag_white:',
      text: '🏳️',
    },
  },
];
