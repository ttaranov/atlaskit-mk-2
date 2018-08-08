import * as React from 'react';
import { ComponentClass } from 'react';

import { defaultEmojiHeight } from '../../constants';
import EmojiPlaceholder from './EmojiPlaceholder';
import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from './LoadingEmojiComponent';
import EmojiProvider from '../../api/EmojiResource';
import {
  Props as ComponentProps,
  BaseResourcedEmojiProps,
} from './ResourcedEmojiComponent';

export interface Props extends BaseResourcedEmojiProps, LoadingProps {}

export default class ResourcedEmoji extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  static Component: ComponentClass<ComponentProps>;

  componentDidMount() {
    if (!ResourcedEmoji.Component) {
      import(/* webpackChunkName:"@atlaskit-internal_resourced-emoji-async" */ './ResourcedEmojiComponent').then(
        module => {
          ResourcedEmoji.Component = module.default;
          this.forceUpdate();
        },
      );
    }
  }

  renderLoading() {
    const { fitToHeight, emojiId, showTooltip } = this.props;
    return (
      <EmojiPlaceholder
        shortName={emojiId.shortName}
        showTooltip={showTooltip}
        size={fitToHeight || defaultEmojiHeight}
      />
    );
  }

  renderLoaded(loadedEmojiProvider: EmojiProvider) {
    const { emojiProvider, ...otherProps } = this.props;
    return (
      <ResourcedEmoji.Component
        {...otherProps}
        emojiProvider={loadedEmojiProvider}
      />
    );
  }

  render() {
    const { loadedEmojiProvider } = this.state;

    if (loadedEmojiProvider && ResourcedEmoji.Component) {
      return this.renderLoaded(loadedEmojiProvider as EmojiProvider);
    }

    return this.renderLoading();
  }
}
