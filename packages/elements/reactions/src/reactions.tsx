import * as React from 'react';
import { Component } from 'react';
import { style } from 'typestyle';
import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import Reaction from './internal/reaction';
import ReactionPicker from './reaction-picker';
import {
  ReactionsProvider,
  ReactionSummary,
  ReactionsState,
  ReactionStatus,
} from './reactions-resource';
import { sortByRelevance, sortByPreviousPosition } from './internal/helpers';

export interface OnEmoji {
  (emojiId: string): any;
}

const reactionStyle = style({
  display: 'inline-block',
  margin: '0 4px',
});

const reactionsStyle = style({
  display: 'flex',
  position: 'relative',
  background: 'white',
  alignItems: 'center',
  borderRadius: '15px',
  $nest: { '& > :first-child': { marginLeft: 0 } },
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
  loading: boolean;
  error: boolean;
}

export default class Reactions extends Component<Props, State> {
  private timeouts: Array<number>;
  private reactionRefs: { [emojiId: string]: Reaction };
  // flag to avoid flashing the background of the first set of rections
  private flashOnMount: boolean = false;

  constructor(props) {
    super(props);
    this.state = { reactions: [], loading: false, error: false };
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

  private getReactionsSortFunction = reactions =>
    reactions && reactions.length
      ? sortByPreviousPosition(reactions)
      : sortByRelevance;

  private updateState = (reactionState: ReactionsState) => {
    if (reactionState.status === ReactionStatus.ready) {
      const newReactions = reactionState.reactions;
      this.setState(
        ({ reactions }) => ({
          loading: false,
          error: false,
          reactions: [...newReactions].sort(
            this.getReactionsSortFunction(reactions),
          ),
        }),
        // setting to true so new reactions will flash on mount
        !this.flashOnMount ? () => (this.flashOnMount = true) : undefined,
      );
    } else if (reactionState.status === ReactionStatus.loading) {
      this.setState({
        error: false,
        loading: true,
        reactions: [],
      });
    } else if (reactionState.status === ReactionStatus.error) {
      this.setState({
        loading: false,
        error: true,
        reactions: [],
      });
    }
  };

  private hasAlreadyReacted(emojiId: any): boolean {
    return (
      this.state.reactions.find(
        reaction => reaction.emojiId === emojiId && reaction.reacted,
      ) !== undefined
    );
  }

  private handleReactionPickerSelection = emojiId => {
    if (!this.hasAlreadyReacted(emojiId)) {
      this.onEmojiClick(emojiId);
    } else {
      this.flash(emojiId);
    }
  };

  private handleReactionRef = (emojiId: string) => (reaction: Reaction) => {
    this.reactionRefs[emojiId] = reaction;
  };

  private getTooltip = (): string | null => {
    switch (true) {
      case this.state.error:
        return 'Sorry... something went wrong';
      case this.state.loading:
        return 'Loading...';
      default:
        return null;
    }
  };

  private renderPicker() {
    const { emojiProvider, boundariesElement, allowAllEmojis } = this.props;

    return (
      <Tooltip content={this.getTooltip()}>
        <ReactionPicker
          className={reactionStyle}
          emojiProvider={emojiProvider}
          onSelection={this.handleReactionPickerSelection}
          miniMode={true}
          boundariesElement={boundariesElement}
          allowAllEmojis={allowAllEmojis}
          disabled={this.state.loading || this.state.error}
        />
      </Tooltip>
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

  private renderReactions = () => this.state.reactions.map(this.renderReaction);

  render() {
    return (
      <div className={reactionsStyle}>
        {this.renderReactions()}
        {this.renderPicker()}
      </div>
    );
  }
}
