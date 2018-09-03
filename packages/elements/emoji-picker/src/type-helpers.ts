import {
  EmojiDescription,
  EmojiId,
  EmojiProvider,
  UploadingEmojiProvider,
} from '@atlaskit/emoji';

export const isPromise = (p): p is Promise<any> =>
  !!(p && (<Promise<any>>p).then);

export const isEmojiIdEqual = (l?: EmojiId, r?: EmojiId) =>
  l === r || (l && r && l.id === r.id && l.shortName === r.shortName);

export const containsEmojiId = (
  emojis: EmojiDescription[],
  emojiId: EmojiId | undefined,
) => {
  if (!emojiId) {
    return false;
  }
  for (let i = 0; i < emojis.length; i++) {
    if (isEmojiIdEqual(emojis[i], emojiId)) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if the emojiProvider can support uploading at a feature level.
 *
 * Follow this up with an isUploadSupported() check to see if the provider is actually
 * configured to support uploads.
 */
export const supportsUploadFeature = (
  emojiProvider: EmojiProvider,
): emojiProvider is UploadingEmojiProvider => {
  const {
    isUploadSupported,
    prepareForUpload,
    uploadCustomEmoji,
  } = emojiProvider as UploadingEmojiProvider;
  return !!(isUploadSupported && prepareForUpload && uploadCustomEmoji);
};
