import { EmojiProvider } from '@atlaskit/emoji';

export interface EmojiContext {
  emoji: {
    emojiProvider: EmojiProvider;
  };
}

export enum UploadStatus {
  Waiting,
  Uploading,
  Error,
}
