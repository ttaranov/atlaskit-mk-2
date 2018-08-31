import * as React from 'react';
import { Component } from 'react';
import { style } from 'typestyle';
import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import Reaction, { ReactionComponent } from './internal/reaction';
import ReactionPicker from './reaction-picker';
import {
  ReactionsProvider,
  ReactionSummary,
  ReactionsState,
  ReactionStatus,
} from './reactions-resource';
import { sortByRelevance, sortByPreviousPosition } from './internal/helpers';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next-types';
import { elementsCreateAndFire } from './analytics';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface OnEmoji {
  (emojiId: string): any;
}

type PreviousState = 'new' | 'existingNotReacted' | 'existingReacted';

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

export class Reactions extends Component<
  Props & WithAnalyticsEventProps,
  State
> {
  private timeouts: Array<number>;
  private reactionRefs: { [emojiId: string]: ReactionComponent };
  // flag to avoid flashing the background of the first set of rections
  private flashOnMount: boolean = false;
  private openTime: number | undefined;
  private renderTime: number | undefined;

  constructor(props) {
    super(props);
    this.state = { reactions: [], loading: false, error: false };
    this.timeouts = [];
    this.reactionRefs = {};
    this.renderTime = Date.now();
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
    if (this.renderTime) {
      const { createAnalyticsEvent, containerAri, ari } = this.props;
      if (createAnalyticsEvent) {
        elementsCreateAndFire({
          action: 'rendered',
          actionSubject: 'reactionView',
          eventType: 'ops',
          attributes: {
            duration: Date.now() - this.renderTime,
            containerAri,
            ari,
          },
        })(createAnalyticsEvent);
      }
      this.renderTime = undefined;
    }
  };

  private findReactionByEmojiId(emojiId: string): ReactionSummary | undefined {
    return this.state.reactions.find(reaction => reaction.emojiId === emojiId);
  }

  private getPreviousState = (reaction?: ReactionSummary): PreviousState => {
    if (reaction) {
      if (reaction.reacted) {
        return 'existingReacted';
      }
      return 'existingNotReacted';
    }
    return 'new';
  };

  private handleReactionPickerSelection = (emojiId, source) => {
    const reaction = this.findReactionByEmojiId(emojiId);
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const { containerAri, ari } = this.props;
      const duration = this.openTime ? Date.now() - this.openTime : undefined;
      elementsCreateAndFire({
        action: 'clicked',
        actionSubject: 'reactionPicker',
        actionSubjectID: 'emoji',
        eventType: 'ui',
        attributes: {
          duration,
          source,
          previousState: this.getPreviousState(reaction),
          emojiId,
          containerAri,
          ari,
        },
      })(createAnalyticsEvent);
    }
    this.openTime = undefined;
    if (reaction && reaction.reacted) {
      this.flash(emojiId);
    } else {
      this.onEmojiClick(emojiId);
    }
  };

  private handleReactionRef = (emojiId: string) => (
    reaction: ReactionComponent,
  ) => {
    this.reactionRefs[emojiId] = reaction;
  };

  private handleOnPickerOpen = () => {
    this.openTime = Date.now();
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const { containerAri, ari } = this.props;
      const { reactions } = this.state;
      elementsCreateAndFire({
        action: 'clicked',
        actionSubject: 'reactionPickerButton',
        eventType: 'ui',
        attributes: {
          reactionEmojiCount: reactions.length,
          containerAri,
          ari,
        },
      })(createAnalyticsEvent);
    }
  };

  private handleOnCancel = () => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const { containerAri, ari } = this.props;
      const duration = this.openTime ? Date.now() - this.openTime : undefined;
      elementsCreateAndFire({
        action: 'cancelled',
        actionSubject: 'reactionPicker',
        eventType: 'ui',
        attributes: {
          duration,
          containerAri,
          ari,
        },
      })(createAnalyticsEvent);
    }
    this.openTime = undefined;
  };

  private handleOnMore = () => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const { containerAri, ari } = this.props;
      const duration = this.openTime ? Date.now() - this.openTime : undefined;
      elementsCreateAndFire({
        action: 'clicked',
        actionSubjectID: 'more',
        actionSubject: 'reactionPicker',
        eventType: 'ui',
        attributes: {
          containerAri,
          ari,
          duration,
        },
      })(createAnalyticsEvent);
    }
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
    const {
      emojiProvider,
      boundariesElement,
      allowAllEmojis,
      containerAri,
      ari,
    } = this.props;

    return (
      <Tooltip content={this.getTooltip()}>
        <FabricElementsAnalyticsContext data={{ containerAri, ari }}>
          <ReactionPicker
            className={reactionStyle}
            emojiProvider={emojiProvider}
            miniMode={true}
            boundariesElement={boundariesElement}
            allowAllEmojis={allowAllEmojis}
            disabled={this.state.loading || this.state.error}
            onSelection={this.handleReactionPickerSelection}
            onOpen={this.handleOnPickerOpen}
            onCancel={this.handleOnCancel}
            onMore={this.handleOnMore}
          />
        </FabricElementsAnalyticsContext>
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
        reaction={reaction}
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

export default withAnalyticsEvents()(Reactions);
