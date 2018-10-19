import * as React from 'react';
import {
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardErroredView,
  InlineCardForbiddenView,
} from '@atlaskit/media-ui';
import { auth } from '@atlaskit/outbound-auth-flow-client';
import { ObjectState } from '../Client';
import { extractBlockPropsFromJSONLD } from '../extractBlockPropsFromJSONLD';
import { extractInlinePropsFromJSONLD } from '../extractInlinePropsFromJSONLD';

export type CardAppearance = 'inline' | 'block';

export interface CardContentProps {
  appearance: CardAppearance;
  state: ObjectState;
  reload: () => void;
  onClick?: () => void;
  isSelected?: boolean;
}

export class CardContent extends React.Component<CardContentProps> {
  get url() {
    const { state } = this.props;
    const data = state.data || {};
    return data.url;
  }

  get collapsedIcon() {
    const { state } = this.props;
    const data = state.data || {};
    if (data.generator && data.generator.icon && data.generator.icon.url) {
      return data.generator.icon.url;
    } else {
      return undefined;
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

  handleAuthorise = () => {
    const { reload, state } = this.props;
    // TODO: figure out how to support multiple services
    const service = state.services[0];
    auth(service.startAuthUrl).then(() => reload(), () => reload());
  };

  handleErrorRetry = () => {
    const { reload } = this.props;
    reload();
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

  renderBlockUnauthorisedState() {
    const { url } = this;
    const { isSelected } = this.props;
    return (
      <BlockCardUnauthorisedView
        icon={this.collapsedIcon}
        isSelected={isSelected}
        url={url}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockForbiddenState() {
    const { url } = this;
    const { isSelected } = this.props;
    return (
      <BlockCardForbiddenView
        url={url}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockNotFoundState() {
    const { url } = this;
    const { isSelected } = this.props;
    return (
      <BlockCardErroredView
        url={url}
        isSelected={isSelected}
        message="We couldn't find this link"
        onClick={this.handleFrameClick}
      />
    );
  }

  renderBlockErroredState() {
    const { url } = this;
    const { isSelected } = this.props;
    return (
      <BlockCardErroredView
        url={url}
        isSelected={isSelected}
        message="We couldn't load this link"
        onClick={this.url && this.handleFrameClick}
        onRetry={this.handleErrorRetry}
      />
    );
  }

  renderBlockResolvedState() {
    const { state, isSelected } = this.props;
    const props = extractBlockPropsFromJSONLD(state.data || {});
    return (
      <BlockCardResolvedView
        {...props}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderBlockCard() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderBlockResolvingState();

      case 'resolved':
        return this.renderBlockResolvedState();

      case 'unauthorized':
        return this.renderBlockUnauthorisedState();

      case 'forbidden':
        return this.renderBlockForbiddenState();

      case 'not-found':
        return this.renderBlockNotFoundState();

      case 'errored':
        return this.renderBlockErroredState();
    }
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

  renderInlineResolvedState() {
    const { state, isSelected } = this.props;
    const props = extractInlinePropsFromJSONLD(state.data || {});
    return (
      <InlineCardResolvedView
        {...props}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineUnauthorisedState() {
    const {
      url,
      props: { isSelected },
    } = this;
    return (
      <InlineCardForbiddenView
        url={url}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderInlineForbiddenState() {
    const {
      url,
      props: { isSelected },
    } = this;
    return (
      <InlineCardForbiddenView
        url={url}
        isSelected={isSelected}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderInlineNotFoundState() {
    const {
      url,
      props: { isSelected },
    } = this;
    return (
      <InlineCardErroredView
        url={url}
        isSelected={isSelected}
        message="We couldn't find this link"
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineErroredState() {
    const {
      url,
      props: { isSelected },
    } = this;
    return (
      <InlineCardErroredView
        url={url}
        isSelected={isSelected}
        message="We couldn't load this link"
        onClick={this.url && this.handleFrameClick}
        onRetry={this.handleErrorRetry}
      />
    );
  }

  renderInlineCard() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderInlineResolvingState();

      case 'resolved':
        return this.renderInlineResolvedState();

      case 'unauthorized':
        return this.renderInlineUnauthorisedState();

      case 'forbidden':
        return this.renderInlineForbiddenState();

      case 'not-found':
        return this.renderInlineNotFoundState();

      case 'errored':
        return this.renderInlineErroredState();
    }
  }

  render() {
    const { appearance } = this.props;
    switch (appearance) {
      case 'inline':
        return this.renderInlineCard();
      default:
        return this.renderBlockCard();
    }
  }
}
