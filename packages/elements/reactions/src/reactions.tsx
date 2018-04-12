import * as React from 'react';
import { Component } from 'react';
import { style } from 'typestyle';
import { EmojiProvider } from '@atlaskit/emoji';
import Reaction from './internal/reaction';
import ReactionPicker from './reaction-picker';
import { ReactionsProvider, ReactionSummary } from './reactions-resource';
import { sortByRelevance, sortByPreviousPosition } from './internal/helpers';

export interface OnEmoji {
  (emojiId: string): any;
}

const reactionStyle = style({
  display: 'inline-block',
  margin: '4px 4px 0 4px',
});

const reactionsGroupStyle = style({
  marginTop: '-4px', // Cancel 4px marginTop when not wrapped on reactionStyle
});

const reactionsStyle = style({
  display: 'flex',
  position: 'relative',
  background: 'white',
  alignItems: 'center',
  borderRadius: '15px',
  $nest: {
    '&> div': {
      display: 'flex',
      flexWrap: 'wrap',
    },
  },
});

export interface Props {
  ari: string;
  containerAri: string;
  reactionsProvider: ReactionsProvider;
  emojiProvider: Promise<EmojiProvider>;
  onReactionClick: OnEmoji;
  onReactionHover?: Function;
  boundariesElement?: string;
  allowAllEmojis?: boolean;
}

export interface State {
  reactions: ReactionSummary[];
}

export default class Reactions extends Component<Props, State> {
  private timeouts: Array<number>;
  private reactionRefs: { [emojiId: string]: Reaction };
  // flag to avoid flashing the background of the first set of rections
  private flashOnMount: boolean = false;

  constructor(props) {
    super(props);
    this.state = { reactions: [] };
    this.timeouts = [];
    this.reactionRefs = {};
  }

  private onEmojiClick = (emojiId: string) => {
    this.props.onReactionClick(emojiId);
  };

  private onReactionHover = (reaction: ReactionSummary) => {
    const { onReactionHover } = this.props;
    if (onReactionHover) {
      onReactionHover(reaction);
    }
  };

  componentDidMount() {
    const { ari, containerAri, reactionsProvider } = this.props;
    reactionsProvider.subscribe({ ari, containerAri }, this.updateState);
  }

  componentWillUnmount() {
    const { ari, containerAri, reactionsProvider } = this.props;
    reactionsProvider.unsubscribe({ ari, containerAri }, this.updateState);
    this.timeouts.forEach(clearTimeout);
  }

  private flash = (emojiId: string) => {
    if (this.reactionRefs[emojiId]) {
      this.reactionRefs[emojiId].flash();
    }
  };

  private getReactionsSortFunction = (reactions: ReactionSummary[]) =>
    reactions.length ? sortByPreviousPosition(reactions) : sortByRelevance;

  private updateState = (newReactions: ReactionSummary[]) => {
    this.setState(
      ({ reactions }) => ({
        reactions: [...newReactions].sort(
          this.getReactionsSortFunction(reactions),
        ),
      }),
      // setting to true so new reactions will flash on mount
      this.flashOnMount ? () => (this.flashOnMount = true) : undefined,
    );
  };

  private hasAlreadyReacted(emojiId: any): boolean {
    return (
      this.state.reactions.find(
        reaction => reaction.emojiId === emojiId && reaction.reacted,
      ) !== undefined
    );
  }

  private handleReactionPickerSelection = emojiId => {
    if (this.hasAlreadyReacted(emojiId)) {
      this.onEmojiClick(emojiId);
    } else {
      this.flash(emojiId);
    }
  };

  private handleReactionRef = (emojiId: string) => (reaction: Reaction) => {
    this.reactionRefs[emojiId] = reaction;
  };

  private renderPicker() {
    const { emojiProvider, boundariesElement, allowAllEmojis } = this.props;

    return (
      <ReactionPicker
        emojiProvider={emojiProvider}
        onSelection={this.handleReactionPickerSelection}
        miniMode={true}
        boundariesElement={boundariesElement}
        allowAllEmojis={allowAllEmojis}
      />
    );
  }

  private renderReaction = (reaction: ReactionSummary, index: number) => {
    const { emojiId } = reaction;
    return (
      <Reaction
        key={emojiId}
        ref={this.handleReactionRef(emojiId)}
        className={reactionStyle}
        reaction={{ ...reaction }}
        emojiProvider={this.props.emojiProvider}
        onClick={this.onEmojiClick}
        onMouseOver={this.onReactionHover}
        flashOnMount={this.flashOnMount}
      />
    );
  };

  private renderReactions = () => {
    const { reactions } = this.state;
    return (
      <div className={reactionsGroupStyle}>
        {reactions.map(this.renderReaction)}
      </div>
    );
  };

  render() {
    return (
      <div className={reactionsStyle}>
        {this.renderPicker()}
        {this.renderReactions()}
      </div>
    );
  }
}
