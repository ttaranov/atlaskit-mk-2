import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { EmojiProvider } from '@atlaskit/emoji';
import * as React from 'react';
import { Reactions } from '../components/Reactions';
import {
  ReactionConsumer,
  ReactionStoreProp,
} from '../reaction-store/ReactionConsumer';
import { ReactionStatus } from '../types/ReactionStatus';

export type Props = {
  containerAri: string;
  ari: string;
  allowAllEmojis?: boolean;
  boundariesElement?: string;
  emojiProvider: Promise<EmojiProvider>;
  store: ReactionStoreProp;
};

export default class ReactionsContainer extends React.PureComponent<Props> {
  private renderChild = props => {
    const { containerAri, ari } = this.props;
    return (
      <FabricElementsAnalyticsContext data={{ containerAri, ari }}>
        <Reactions
          key={`${this.props.containerAri}|${this.props.ari}`}
          {...this.props}
          {...props}
        />
      </FabricElementsAnalyticsContext>
    );
  };

  private stateMapper = state => {
    const { containerAri, ari } = this.props;
    const reactionsState = state.reactions[`${containerAri}|${ari}`];
    if (!reactionsState) {
      return { status: ReactionStatus.notLoaded };
    }
    switch (reactionsState.status) {
      case ReactionStatus.ready:
        return {
          reactions: reactionsState.reactions,
          status: reactionsState.status,
          flash: state.flash[`${containerAri}|${ari}`],
        };
      default:
        return { status: ReactionStatus.loading };
    }
  };

  private actionsMapper = actions => ({
    loadReaction: () => {
      actions.getReactions(this.props.containerAri, this.props.ari);
    },
    onReactionClick: (emojiId: string) => {
      actions.toggleReaction(this.props.containerAri, this.props.ari, emojiId);
    },
    onReactionHover: (emojiId: string) => {
      actions.getDetailedReaction(
        this.props.containerAri,
        this.props.ari,
        emojiId,
      );
    },
    onSelection: emojiId => {
      actions.addReaction(this.props.containerAri, this.props.ari, emojiId);
    },
  });

  render() {
    return (
      <ReactionConsumer
        store={this.props.store}
        actionsMapper={this.actionsMapper}
        stateMapper={this.stateMapper}
      >
        {this.renderChild}
      </ReactionConsumer>
    );
  }
}
