import * as React from 'react';
import * as cx from 'classnames';
import { PureComponent, SyntheticEvent } from 'react';
import { style, keyframes } from 'typestyle';
import {
  EmojiId,
  EmojiProvider,
  OnEmojiEvent,
  OptionalEmojiDescription,
} from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import { borderRadius, colors } from '@atlaskit/theme';
import EmojiButton from './emoji-button';

import { equalEmojiId } from './helpers';

export interface Props {
  emojiProvider: Promise<EmojiProvider>;
  onSelection: OnEmojiEvent;
  showMore: boolean;
  onMoreClick: React.MouseEventHandler<HTMLElement>;
}

const selectorStyle = style({
  boxSizing: 'border-box',
  display: 'flex',
  padding: 0,
});

const emojiStyle = style({
  display: 'inline-block',
  opacity: 0,
  $nest: {
    '&.selected': {
      transition: 'transform 200ms ease-in-out  ',
      transform: 'translateY(-48px) scale(2.667)',
    },
  },
});

const moreButtonStyle = style({
  opacity: 0,
  outline: 'none',
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: borderRadius(),
  cursor: 'pointer',
  margin: '4px 4px 4px 0',
  padding: '4px',
  width: '38px',
  verticalAlign: 'top',
  $nest: {
    '&:hover': {
      backgroundColor: colors.N30A,
    },
  },
});

const revealAnimation = keyframes({
  '0%': {
    transform: 'scale(0.5)',
  },
  '75%': {
    transform: 'scale(1.25)',
  },
  '100%': {
    transform: 'scale(1)',
  },
});

const reveal = style({
  opacity: 1,
  animation: `${revealAnimation} 150ms ease-in-out`,
});

const moreEmojiContainerStyle = style({
  display: 'flex',
});

const separatorStyle = style({
  backgroundColor: colors.N30A,
  margin: '8px 8px 8px 4px',
  width: '1px',
  height: '60%',
  display: 'inline-block',
});

export const defaultReactionsByShortName: Map<string, EmojiId> = new Map<
  string,
  EmojiId
>([
  [':thumbsup:', { id: '1f44d', shortName: ':thumbsup:' }],
  [':thumbsdown:', { id: '1f44e', shortName: ':thumbsdown:' }],
  [':grinning:', { id: '1f600', shortName: ':grinning:' }],
  [':tada:', { id: '1f389', shortName: ':tada:' }],
  [':heart:', { id: '2764', shortName: ':heart:' }],
]);

export const defaultReactions: EmojiId[] = [
  defaultReactionsByShortName.get(':thumbsup:') as EmojiId,
  defaultReactionsByShortName.get(':thumbsdown:') as EmojiId,
  defaultReactionsByShortName.get(':grinning:') as EmojiId,
  defaultReactionsByShortName.get(':tada:') as EmojiId,
  defaultReactionsByShortName.get(':heart:') as EmojiId,
];

export const isDefaultReaction = (emojiId: EmojiId) =>
  defaultReactions.filter(otherEmojiId => equalEmojiId(otherEmojiId, emojiId))
    .length > 0;

export interface State {
  selection: EmojiId | undefined;
  animationIndex: number;
}

export default class Selector extends PureComponent<Props, State> {
  private timeouts: Array<number>;
  private animationInterval: number;

  constructor(props) {
    super(props);
    this.timeouts = [];

    this.state = {
      selection: undefined,
      animationIndex: 0,
    };
  }

  componentWillUnmount() {
    this.timeouts.forEach(clearTimeout);
    clearInterval(this.animationInterval);
  }

  componentDidMount() {
    this.revealButtons();
  }

  private revealButtons = () => {
    this.animationInterval = setInterval(
      () =>
        this.setState(({ animationIndex }) => {
          const nextAnimationIndex = animationIndex + 1;
          if (nextAnimationIndex === defaultReactions.length) {
            clearInterval(this.animationInterval);
          }
          return { animationIndex: nextAnimationIndex };
        }),
      50,
    );
  };

  private onEmojiSelected = (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
    event: SyntheticEvent<any>,
  ) => {
    this.timeouts.push(
      setTimeout(() => this.props.onSelection(emojiId, emoji, event), 250),
    );
    this.setState({
      selection: emojiId,
    });
  };

  render() {
    const { emojiProvider, showMore } = this.props;

    return (
      <div className={selectorStyle}>
        {defaultReactions.map((emojiId, index) => {
          const key = emojiId.id || emojiId.shortName;

          const classNames = cx(emojiStyle, {
            selected: emojiId === this.state.selection,
            [reveal]: this.state.animationIndex >= index,
          });

          return (
            <div className={classNames} key={key}>
              <Tooltip content={emojiId.shortName}>
                <EmojiButton
                  emojiId={emojiId}
                  emojiProvider={emojiProvider}
                  onClick={this.onEmojiSelected}
                />
              </Tooltip>
            </div>
          );
        })}

        {showMore && (
          <div className={moreEmojiContainerStyle} key="more">
            <div className={separatorStyle} />
            <Tooltip content="More emoji">
              <button
                className={cx(moreButtonStyle, {
                  [reveal]:
                    this.state.animationIndex >= defaultReactions.length,
                })}
                onMouseDown={this.props.onMoreClick}
              >
                <EditorMoreIcon label="More" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}
