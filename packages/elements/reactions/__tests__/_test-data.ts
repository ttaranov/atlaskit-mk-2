import { EmojiDescription, toEmojiId } from '@atlaskit/emoji';
import { testData } from '@atlaskit/emoji/dist/es5/support';

const { newEmojiRepository } = testData;
const emojiRepository = newEmojiRepository();

export const grinningId = toEmojiId(emojiRepository.findByShortName(
  ':grinning:',
) as EmojiDescription);
export const laughingId = toEmojiId(emojiRepository.findByShortName(
  ':sweat_smile:',
) as EmojiDescription);
export const thumbsupId = toEmojiId(emojiRepository.findByShortName(
  ':thumbsup:',
) as EmojiDescription);
export const grinId = toEmojiId(emojiRepository.findByShortName(
  ':grin:',
) as EmojiDescription);
export const smileyId = toEmojiId(emojiRepository.findByShortName(
  ':smiley:',
) as EmojiDescription);
