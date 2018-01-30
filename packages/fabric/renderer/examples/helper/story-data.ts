import {
  storyData as emojiStoryData,
  testData as emojiTestData,
} from '@atlaskit/emoji/dist/es5/support';

const toEmojiAttrs = emoji => {
  const { shortName, id, fallback } = emoji;
  return {
    shortName,
    id,
    text: fallback || shortName,
  };
};

const toEmojiId = emoji => {
  const { shortName, id, fallback } = emoji;
  return { shortName, id, fallback };
};

export const grinEmojiAttrs = toEmojiAttrs(emojiTestData.grinEmoji);
export const evilburnsEmojiAttrs = toEmojiAttrs(emojiTestData.evilburnsEmoji);

export const grinEmojiId = toEmojiId(emojiTestData.grinEmoji);
export const evilburnsEmojiId = toEmojiId(emojiTestData.evilburnsEmoji);

export const lorem = emojiStoryData.lorem;

export const document = {
  type: 'doc',
  version: 1,
  content: [
    {
      content: [
        {
          type: 'emoji',
          attrs: {
            ...grinEmojiAttrs,
          },
        },
      ],
    },
  ],
};
