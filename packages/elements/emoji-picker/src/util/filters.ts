import { EmojiProvider, EmojiDescription } from '@atlaskit/emoji';

const toneEmojiShortName = ':raised_hand:';

type OptionalEmojiDescription = EmojiDescription | undefined;

export const getToneEmoji = (
  provider: EmojiProvider,
): OptionalEmojiDescription | Promise<OptionalEmojiDescription> =>
  provider.findByShortName(toneEmojiShortName);
