// @ts-ignore
import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { Reactions } from '../components/Reactions';
import { connectWithReactionsProvider } from '../reaction-store/connect';
import { State } from '../reaction-store/ReactionProvider';
import { OnEmoji, OnReaction } from '../types/Actions';
import { ReactionStatus } from '../types/ReactionStatus';
import { ReactionSummary } from '../types/ReactionSummary';

type PropsFromState = {
  reactions: ReactionSummary[];
  status: ReactionStatus;
  flash?: {
    [emojiId: string]: boolean;
  };
};

type OwnProps = {
  allowAllEmojis?: boolean;
  boundariesElement?: string;
  emojiProvider: Promise<EmojiProvider>;
};

type ActionProps = {
  loadReaction: (containerAri: string, ari: string) => void;
  onReactionClick: OnEmoji;
  onSelection: OnEmoji;
  onReactionHover?: OnReaction;
};

export default connectWithReactionsProvider<
  OwnProps,
  PropsFromState,
  ActionProps,
  { containerAri: string; ari: string }
>(
  (state: State, props) => {
    const reactionsState =
      state.reactions[`${props.containerAri}|${props.ari}`];
    if (!reactionsState) {
      return { status: ReactionStatus.notLoaded, reactions: [] };
    }
    switch (reactionsState.status) {
      case ReactionStatus.ready:
        return {
          reactions: reactionsState.reactions,
          status: reactionsState.status,
          flash: state.flash[`${props.containerAri}|${props.ari}`],
        };
      default:
        return { status: ReactionStatus.loading, reactions: [] };
    }
  },
  (actions, { containerAri, ari }) => ({
    loadReaction() {
      actions.getReactions(containerAri, ari);
    },
    onReactionClick(emojiId: string) {
      actions.toggleReaction(containerAri, ari, emojiId);
    },
    onReactionHover(emojiId: string) {
      actions.getDetailedReaction(containerAri, ari, emojiId);
    },
    onSelection(emojiId) {
      actions.addReaction(containerAri, ari, emojiId);
    },
  }),
)(Reactions);
