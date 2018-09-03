import { EmojiProvider } from '../api/EmojiResource';
import { EmojiDescription, OptionalEmojiDescription } from '../types';

const toneEmojiShortName = ':raised_hand:';

const byShortName = (
  emojis: EmojiDescription[],
  shortName: string,
): EmojiDescription => emojis.filter(emoji => emoji.shortName === shortName)[0];

const toneEmoji = (emojis: EmojiDescription[]) =>
  byShortName(emojis, toneEmojiShortName);

export default {
  byShortName,
  toneEmoji,
};
