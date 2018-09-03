import { EmojiProvider, OptionalEmojiDescription } from '@atlaskit/emoji';

const toneEmojiShortName = ':raised_hand:';

export const getToneEmoji = (
  provider: EmojiProvider,
): OptionalEmojiDescription | Promise<OptionalEmojiDescription> =>
  provider.findByShortName(toneEmojiShortName);
