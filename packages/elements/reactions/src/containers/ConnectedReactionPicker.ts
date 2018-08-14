// @ts-ignore
import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { ReactionPicker } from '../components/ReactionPicker';
import { connectWithReactionsProvider } from '../reaction-store/connect';

export type PropsFromState = {};

export type OwnProps = {
  emojiProvider: Promise<EmojiProvider>;
  miniMode?: boolean;
  boundariesElement?: string;
  className?: string;
  allowAllEmojis?: boolean;
  disabled?: boolean;
};

export type ActionProps = {
  onSelection?: (emojiId: string) => void;
};

export default connectWithReactionsProvider<
  OwnProps,
  PropsFromState,
  ActionProps,
  { containerAri: string; ari: string }
>(
  () => ({}),
  (stateManager, { containerAri, ari }) => ({
    onSelection(emojiId) {
      stateManager.addReaction(containerAri, ari, emojiId);
    },
  }),
)(ReactionPicker);
