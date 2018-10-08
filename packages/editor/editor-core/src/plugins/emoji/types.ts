import {
  EmojiProvider,
  EmojiDescription,
  EmojiSearchResult,
} from '@atlaskit/emoji';

export interface EmojiProviderHandler {
  result: (result: EmojiSearchResult) => void;
}

export interface EmojiPluginState {
  provider?: EmojiProvider;
  providerHandler?: EmojiProviderHandler;
  emojis?: Array<EmojiDescription>;
}

export type EmojiPluginAction =
  | {
      type: 'SET_PROVIDER';
      provider?: EmojiProvider;
      providerHandler?: EmojiProviderHandler;
    }
  | {
      type: 'SET_EMOJIS';
      emojis: Array<EmojiDescription>;
    };
