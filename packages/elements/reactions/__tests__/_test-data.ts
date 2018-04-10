import { EmojiDescription, toEmojiId } from '@atlaskit/emoji';
import { emoji } from '@atlaskit/util-data-test';

const { newEmojiRepository } = emoji.testData;
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
export const flagBlackId = toEmojiId(emojiRepository.findByShortName(
  ':flag_black:',
) as EmojiDescription);
export const thumbsdownId = toEmojiId(emojiRepository.findByShortName(
  ':thumbsdown:',
) as EmojiDescription);
