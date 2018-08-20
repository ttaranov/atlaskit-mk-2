import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { style } from 'typestyle';
import { OnEmoji, OnReaction } from '../types/Actions';
import { ReactionStatus } from '../types/ReactionStatus';
import { ReactionSummary } from '../types/ReactionSummary';
import { Reaction } from './reaction';
import { ReactionPicker } from './ReactionPicker';

const reactionStyle = style({
  display: 'inline-block',
  // top margin of 2px to allow spacing between rows when wrapped (paired with top margin in reactionsStyle)
  margin: '2px 4px 0 4px',
});

const reactionsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  background: 'white',
  alignItems: 'center',
  borderRadius: '15px',
  // To allow to row spacing of 2px on wrap, and 0px on first row
  marginTop: '-2px',
  $nest: { '& > :first-child': { marginLeft: 0 } },
});

export type Props = {
  reactions: ReactionSummary[];
  status: ReactionStatus;
  loadReaction: () => void;
  onSelection: OnEmoji;

  onReactionClick: OnEmoji;
  onReactionHover?: OnReaction;
  allowAllEmojis?: boolean;
  flash?: {
    [emojiId: string]: boolean;
  };
  boundariesElement?: string;
  errorMessage?: string;
  emojiProvider: Promise<EmojiProvider>;
};

export class Reactions extends React.PureComponent<Props> {
  static defaultProps = {
    flash: {},
  };

  componentDidMount() {
    if (this.props.status === ReactionStatus.notLoaded) {
      this.props.loadReaction();
    }
  }

  private isDisabled = (): boolean =>
    this.props.status !== ReactionStatus.ready;

  private getTooltip = (): string | undefined => {
    const { status, errorMessage } = this.props;
    switch (status) {
      case ReactionStatus.error:
        return errorMessage ? errorMessage : 'Sorry... something went wrong';
      case ReactionStatus.loading:
      case ReactionStatus.notLoaded:
        return 'Loading...';
      default:
        return undefined;
    }
  };

  private handleReactionMouseOver = (reaction: ReactionSummary) => {
    if (this.props.onReactionHover) {
      this.props.onReactionHover(reaction.emojiId);
    }
  };

  private renderPicker() {
    const {
      emojiProvider,
      boundariesElement,
      allowAllEmojis,
      onSelection,
    } = this.props;

    const picker = (
      <ReactionPicker
        className={reactionStyle}
        emojiProvider={emojiProvider}
        miniMode={true}
        boundariesElement={boundariesElement}
        allowAllEmojis={allowAllEmojis}
        disabled={this.isDisabled()}
        onSelection={onSelection}
      />
    );

    const tooltipContent = this.getTooltip();
    if (tooltipContent) {
      return <Tooltip content={tooltipContent}>{picker}</Tooltip>;
    }
    return picker;
  }

  private renderReaction = (reaction: ReactionSummary) => (
    <Reaction
      key={reaction.emojiId}
      className={reactionStyle}
      reaction={reaction}
      emojiProvider={this.props.emojiProvider}
      onClick={this.props.onReactionClick}
      onMouseOver={this.handleReactionMouseOver}
      flash={this.props.flash![reaction.emojiId]}
    />
  );

  render() {
    return (
      <div className={reactionsStyle}>
        {this.props.reactions.map(this.renderReaction)}
        {this.renderPicker()}
      </div>
    );
  }
}
