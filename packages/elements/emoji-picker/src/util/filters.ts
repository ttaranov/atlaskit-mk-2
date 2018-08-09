import { EmojiProvider } from '../../../emoji/dist/es5';
import { EmojiDescription, OptionalEmojiDescription } from '../common/types';

const toneEmojiShortName = ':raised_hand:';

const byShortName = (
  emojis: EmojiDescription[],
  shortName: string,
): EmojiDescription => emojis.filter(emoji => emoji.shortName === shortName)[0];

const toneEmoji = (emojis: EmojiDescription[]) =>
  byShortName(emojis, toneEmojiShortName);

export const getToneEmoji = (
  provider: EmojiProvider,
): OptionalEmojiDescription | Promise<OptionalEmojiDescription> =>
  provider.findByShortName(toneEmojiShortName);

export default {
  byShortName,
  toneEmoji,
};
