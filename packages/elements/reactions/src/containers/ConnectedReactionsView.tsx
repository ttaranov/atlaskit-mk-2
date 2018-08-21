import * as React from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { Reactions } from '../components/Reactions';
import { ReactionConsumer } from '../reaction-store/ReactionConsumer';
import { ReactionStatus } from '../types/ReactionStatus';

export type Props = {
  containerAri: string;
  ari: string;
  allowAllEmojis?: boolean;
  boundariesElement?: string;
  emojiProvider: Promise<EmojiProvider>;
};

export default class ReactionsContainer extends React.PureComponent<Props> {
  private renderChild = props => (
    <Reactions
      key={`${this.props.containerAri}|${this.props.ari}`}
      {...this.props}
      {...props}
    />
  );

  private stateMapper = state => {
    const { containerAri, ari } = this.props;
    const reactionsState = state.reactions[`${containerAri}|${ari}`];
    if (!reactionsState) {
      return { status: ReactionStatus.notLoaded, reactions: [] };
    }
    switch (reactionsState.status) {
      case ReactionStatus.ready:
        return {
          reactions: reactionsState.reactions,
          status: reactionsState.status,
          flash: state.flash[`${containerAri}|${ari}`],
        };
      default:
        return { status: ReactionStatus.loading, reactions: [] };
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
        actionsMapper={this.actionsMapper}
        stateMapper={this.stateMapper}
      >
        {this.renderChild}
      </ReactionConsumer>
    );
  }
}
