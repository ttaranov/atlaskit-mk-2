import { EmojiProvider, ResourcedEmoji } from '@atlaskit/emoji';
import { borderRadius, colors } from '@atlaskit/theme';
import * as cx from 'classnames';
import * as React from 'react';
import { PureComponent, SyntheticEvent } from 'react';
import { style } from 'typestyle';
import { ReactionSummary } from '../reactions-resource';
import { isLeftClick } from './helpers';
import { analyticsService } from '../analytics';
import ReactionTooltip from './reaction-tooltip';
import { isPromise } from './helpers';
import Counter from './counter';
import FlashAnimation from './flash-animation';

const akBorderRadius = borderRadius();
const akColorN30A = colors.N30A;
const akColorN400 = colors.N400;

const emojiStyle = style({
  transformOrigin: 'center center 0',
  margin: '0 4px',
});

const reactionStyle = style({
  outline: 'none',
  display: 'flex',
  flexDirection: 'row',
  minWidth: '36px',
  height: '24px',
  lineHeight: '24px',
  background: 'transparent',
  border: '0',
  borderRadius: akBorderRadius,
  color: akColorN400,
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  transition: '200ms ease-in-out',
  $nest: { '&:hover': { background: akColorN30A } },
});

const flashStyle = style({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: akBorderRadius,
});

const counterStyle = style({
  padding: '0 4px 0 0',
});

export interface ReactionOnClick {
  (emojiId: string, event?: SyntheticEvent<any>): void;
}

export interface Props {
  reaction: ReactionSummary;
  emojiProvider: Promise<EmojiProvider>;
  onClick: ReactionOnClick;
  className?: string;
  onMouseOver?: (
    reaction: ReactionSummary,
    event?: SyntheticEvent<any>,
  ) => void;
  flashOnMount?: boolean;
}

export interface State {
  emojiName?: string;
}

export default class Reaction extends PureComponent<Props, State> {
  private flashRef: FlashAnimation;
  private mounted: boolean;

  static defaultProps = {
    flash: false,
    className: undefined,
    onMouseOver: undefined,
    flashOnMount: false,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate({ reaction: prevReaction }) {
    if (!prevReaction.reacted && this.props.reaction.reacted) {
      this.flash();
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.props.emojiProvider.then(emojiResource => {
      const foundEmoji = emojiResource.findByEmojiId({
        shortName: '',
        id: this.props.reaction.emojiId,
      });

      if (isPromise(foundEmoji)) {
        foundEmoji.then(emoji => {
          if (emoji) {
            if (this.mounted) {
              this.setState({
                emojiName: emoji.name,
              });
            }
          }
        });
      } else if (foundEmoji) {
        this.setState({
          emojiName: foundEmoji.name,
        });
      }
    });
    if (this.props.flashOnMount && this.props.reaction.reacted) {
      this.flash();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private handleMouseDown = event => {
    event.preventDefault();
    if (this.props.onClick && isLeftClick(event)) {
      const { reaction } = this.props;
      analyticsService.trackEvent('reactions.reaction.click', reaction as {});

      this.props.onClick(this.props.reaction.emojiId, event);
    }
  };

  private handleMouseOver = event => {
    event.preventDefault();
    const { onMouseOver, reaction } = this.props;
    if (onMouseOver) {
      if (!reaction.users || !reaction.users.length) {
        onMouseOver(this.props.reaction, event);
      }
    }
  };

  private handleFlashRef = (flash: FlashAnimation) => {
    this.flashRef = flash;
  };

  public flash = () => {
    if (this.flashRef) {
      this.flashRef.flash();
    }
  };

  render() {
    const { emojiProvider, reaction, className: classNameProp } = this.props;
    const { emojiName } = this.state;

    const classNames = cx(reactionStyle, classNameProp);

    const emojiId = { id: reaction.emojiId, shortName: '' };

    return (
      <ReactionTooltip emojiName={emojiName} reaction={reaction}>
        <button
          className={classNames}
          onMouseUp={this.handleMouseDown}
          onMouseOver={this.handleMouseOver}
        >
          <FlashAnimation ref={this.handleFlashRef} className={flashStyle}>
            <div className={emojiStyle}>
              <ResourcedEmoji
                emojiProvider={emojiProvider}
                emojiId={emojiId}
                fitToHeight={16}
              />
            </div>
            <Counter
              className={counterStyle}
              value={reaction.count}
              highlight={reaction.reacted}
            />
          </FlashAnimation>
        </button>
      </ReactionTooltip>
    );
  }
}
