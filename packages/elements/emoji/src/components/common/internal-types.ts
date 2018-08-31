import { EmojiProvider } from '../../api/EmojiResource';

export interface EmojiContext {
  emoji: {
    emojiProvider: EmojiProvider;
  };
}
