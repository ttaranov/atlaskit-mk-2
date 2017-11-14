// Defaut emoji id for Confluence glyphs that has no match to Fabric Emoji
const DEFAULT_EMOJI_ID = '2b50';

// Defaut ac:name for emoticons as a fallback is `blue-star`
const DEFAULT_EMOJI_ACNAME = 'blue-star';

// ac:hipchat-emoticon prefix when converting to Emoji ID
const HC_EMOTICON_PREFIX = 'atlassian-';

/**
 * Confluence glyphs ac:name of <ac:emoticon /> map to new emojis
 * {
 *   [ac:name] : ['emoji-id', 'emoji-shortName', 'emoji-fallback']
 *   ...
 * }
 * Glyphs that do not map to Fabric Emoji
 * will be mapped to Emoji Id '2b50' (:star:) with preserving ac:name as shortName attribute;
 */
const acNameToEmojiMap = {
  smile: ['1f642', ':slight_smile:' , '\uD83D\uDE42'],
  sad: ['1f641', ':slight_frown:', '\uD83D\uDE41'],
  cheeky: ['1f61b', ':stuck_out_tongue:', '\uD83D\uDE1B'],
  laugh: ['1f600', ':grinning:', '\uD83D\uDE00'],
  wink: ['1f609', ':wink:', '\uD83D\uDE09'],
  information: ['2139', ':information_source:', 'ℹ'],
  tick: ['2705', ':white_check_mark:', '✅'],
  cross: ['274e', ':negative_squared_cross_mark:', '❎'],
  warning: ['26a0', ':warning:', '⚠'],
  plus: ['2795', ':heavy_plus_sign:', '➕'],
  minus: ['2796', ':heavy_minus_sign:', '➖'],
  question: ['2753', ':question:', '❓'],
  heart: ['2764', ':heart:', '❤'],
  'broken-heart': ['1f494', ':broken_heart:', '\uD83D\uDC94'],
  'thumbs-up': ['1f44d', ':thumbsup:', '\uD83D\uDC4D'],
  'thumbs-down': ['1f44e', ':thumbsdown:', '\uD83D\uDC4E'],
  'light-on': ['1f4a1', ':bulb:', '\uD83D\uDCA1'],
  'yellow-star': ['2b50', ':star:', '⭐'],
  'light-off': null,
  'red-star': null,
  'green-star': null,
  'blue-star': null
};

export function acNameToEmoji(acName: string) {
  const emojiData = acNameToEmojiMap[acName];
  return emojiData
    ? {
      id: emojiData[0],
      shortName: emojiData[1],
      text: emojiData[2]
    }
    : {
      id: DEFAULT_EMOJI_ID,
      shortName: `:${acName}:`,
      text: ''
    };
}

export function emojiIdToAcName(emojiId: string) {
  const filterEmojis = acName => acNameToEmojiMap[acName] ? acNameToEmojiMap[acName][0] === emojiId : false;
  return Object.keys(acNameToEmojiMap).filter(filterEmojis)[0];
}

export function acShortcutToEmoji(hipchatEmoticonShortName: string) {
  return {
    id: `${HC_EMOTICON_PREFIX}${hipchatEmoticonShortName}`,
    shortName: `:${hipchatEmoticonShortName}:`,
    text: ''
  };
}

function getAcNameFromShortName(shortName: string) {
  return shortName.slice(
    shortName[0] === ':' ? 1 : 0,
    shortName[shortName.length - 1] === ':' ? -1 : shortName.length
  );
}

export function getEmojiAcName({ id, shortName }) {

  if (DEFAULT_EMOJI_ID === id) {
    const possibleName = getAcNameFromShortName(shortName);
    if (possibleName in acNameToEmojiMap) {
      return possibleName;
    }
  }

  return emojiIdToAcName(id) || DEFAULT_EMOJI_ACNAME;
}
