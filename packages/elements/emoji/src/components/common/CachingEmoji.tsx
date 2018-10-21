import * as React from 'react';
import * as PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { EmojiDescription, EmojiId } from '../../types';
import { isMediaEmoji, isPromise } from '../../type-helpers';
import debug from '../../util/logger';
import { EmojiContext } from './internal-types';
import Emoji, { Props as EmojiProps } from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { shouldUseAltRepresentation } from '../../api/EmojiUtils';

export interface State {
  cachedEmoji?: EmojiDescription;
  invalidImage?: boolean;
}

export interface CachingEmojiProps extends EmojiProps {
  placeholderSize?: number;
}

/**
 * Renders an emoji from a cached image, if required.
 */
export const CachingEmoji = (props: CachingEmojiProps) => {
  // tslint:disable-line:variable-name
  // Optimisation to only render the class based CachingMediaEmoji if necessary
  // slight performance hit, which accumulates for a large number of emoji.
  const { placeholderSize, ...emojiProps } = props;
  if (isMediaEmoji(props.emoji)) {
    return <CachingMediaEmoji {...props} />;
  }
  return <Emoji {...emojiProps} />;
};

/**
 * Rendering a media emoji image from a cache for media emoji, with different
 * rendering paths depending on caching strategy.
 */
export class CachingMediaEmoji extends PureComponent<CachingEmojiProps, State> {
  static contextTypes = {
    emoji: PropTypes.object,
  };

  private mounted: boolean;

  context: EmojiContext;

  constructor(props: EmojiProps, context: EmojiContext) {
    super(props, context);

    this.state = {
      cachedEmoji: this.loadEmoji(props.emoji, context, false),
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps: EmojiProps, nextContext: EmojiContext) {
    if (nextProps.emoji !== this.props.emoji) {
      if (this.mounted) {
        this.setState({
          cachedEmoji: this.loadEmoji(nextProps.emoji, nextContext, false),
        });
      }
    }
  }

  private loadEmoji(
    emoji: EmojiDescription,
    context: EmojiContext,
    forceLoad: boolean,
  ): EmojiDescription | undefined {
    if (!context.emoji) {
      return undefined;
    }
    const { emojiProvider } = context.emoji;
    if (!emojiProvider) {
      return undefined;
    }
    const { fitToHeight } = this.props;
    const useAlt = shouldUseAltRepresentation(emoji, fitToHeight);

    const optimisticRendering = emojiProvider.optimisticMediaRendering(
      emoji,
      useAlt,
    );

    if (optimisticRendering && !forceLoad) {
      debug('Optimistic rendering', emoji.shortName);
      return emoji;
    }
    debug('Loading image via media cache', emoji.shortName);
    const loadedEmoji = emojiProvider.loadMediaEmoji(emoji, useAlt);

    if (isPromise(loadedEmoji)) {
      loadedEmoji
        .then(cachedEmoji => {
          if (this.mounted) {
            this.setState({
              cachedEmoji,
              invalidImage: !cachedEmoji,
            });
          }
        })
        .catch(err => {
          if (this.mounted) {
            this.setState({
              cachedEmoji: undefined,
              invalidImage: true,
            });
          }
        });
      return undefined;
    }
    return loadedEmoji;
  }

  private handleLoadError = (emojiId: EmojiId, emoji?: EmojiDescription) => {
    const { invalidImage } = this.state;

    if (invalidImage || !emoji) {
      // do nothing, bad image
      return;
    }

    this.setState({
      cachedEmoji: this.loadEmoji(emoji, this.context, true),
    });
  };

  render() {
    const { cachedEmoji } = this.state;
    const { children, placeholderSize, ...otherProps } = this.props;

    let emojiComponent;
    if (cachedEmoji) {
      emojiComponent = (
        <Emoji
          {...otherProps}
          emoji={cachedEmoji}
          onLoadError={this.handleLoadError}
        />
      );
    } else {
      const { emoji, placeholderSize, showTooltip, fitToHeight } = this.props;
      const { shortName, representation } = emoji;
      emojiComponent = (
        <EmojiPlaceholder
          size={fitToHeight || placeholderSize}
          shortName={shortName}
          showTooltip={showTooltip}
          representation={representation}
        />
      );
    }

    return emojiComponent;
  }
}

export default CachingEmoji;
