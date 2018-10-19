import * as React from 'react';
import {
  BlockCardResolvingView,
  InlineCardResolvingView,
} from '@atlaskit/media-ui';
import {
  CardContentProps,
  CardContent as CardContentType,
} from './CardContent';

export class CardContentLoader extends React.Component<CardContentProps> {
  static CardContent: typeof CardContentType | null = null;

  get url() {
    const { state } = this.props;
    const data = state.data || {};
    return data.url;
  }

  componentDidMount() {
    if (!CardContentLoader.CardContent) {
      import(/* webpackChunkName:"@atlaskit-internal-smartcard-cardcontent" */ './CardContent').then(
        module => {
          CardContentLoader.CardContent = module.CardContent;
          this.forceUpdate();
        },
      );
    }
  }

  handleFrameClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    } else {
      window.open(this.url);
    }
  };

  renderBlockResolvingState() {
    const { isSelected } = this.props;
    return (
      <BlockCardResolvingView
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineResolvingState() {
    const {
      url,
      props: { isSelected },
    } = this;
    return (
      <InlineCardResolvingView
        url={url}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  render() {
    if (CardContentLoader.CardContent) {
      return <CardContentLoader.CardContent {...this.props} />;
    }

    const { appearance } = this.props;
    switch (appearance) {
      case 'inline':
        return this.renderInlineResolvingState();
      default:
        return this.renderBlockResolvingState();
    }
  }
}
