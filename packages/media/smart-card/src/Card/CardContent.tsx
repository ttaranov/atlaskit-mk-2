import * as React from 'react';
import { BlockCard, InlineCard } from '@atlaskit/media-ui';
import { auth } from '@atlassian/outbound-auth-flow-client';
import { ObjectState } from '../Client';
import { extractBlockPropsFromJSONLD } from '../extractBlockPropsFromJSONLD';
import { extractInlinePropsFromJSONLD } from '../extractInlinePropsFromJSONLD';

export type CardAppearance = 'inline' | 'block';

export interface CardContentProps {
  appearance: CardAppearance;
  state: ObjectState;
  reload: () => void;
  onClick?: () => void;
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
    return (
      <BlockCard.ResolvingView onClick={this.url && this.handleFrameClick} />
    );
  }

  renderBlockUnauthorisedState() {
    const { url } = this;
    return (
      <BlockCard.UnauthorisedView
        icon={this.collapsedIcon}
        url={url}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockForbiddenState() {
    const { url } = this;
    return (
      <BlockCard.ForbiddenView
        url={url}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockNotFoundState() {
    const { url } = this;
    return (
      <BlockCard.ErroredView
        url={url}
        message="We couldn't find this link"
        onClick={this.handleFrameClick}
      />
    );
  }

  renderBlockErroredState() {
    const { url } = this;
    return (
      <BlockCard.ErroredView
        url={url}
        message="We couldn't load this link"
        onClick={this.url && this.handleFrameClick}
        onRetry={this.handleErrorRetry}
      />
    );
  }

  renderBlockResolvedState() {
    const { state } = this.props;
    const props = extractBlockPropsFromJSONLD(state.data || {});
    return (
      <BlockCard.ResolvedView
        {...props}
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
    const { url } = this;
    return (
      <InlineCard.ResolvingView
        url={url}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineResolvedState() {
    const { state } = this.props;
    const props = extractInlinePropsFromJSONLD(state.data || {});
    return (
      <InlineCard.ResolvedView
        {...props}
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineUnauthorisedState() {
    const { url } = this;
    return (
      <InlineCard.ForbiddenView
        url={url}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderInlineForbiddenState() {
    const { url } = this;
    return (
      <InlineCard.ForbiddenView
        url={url}
        onClick={this.url && this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderInlineNotFoundState() {
    const { url } = this;
    return (
      <InlineCard.ErroredView
        url={url}
        message="We couldn't find this link"
        onClick={this.url && this.handleFrameClick}
      />
    );
  }

  renderInlineErroredState() {
    const { url } = this;
    return (
      <InlineCard.ErroredView
        url={url}
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
