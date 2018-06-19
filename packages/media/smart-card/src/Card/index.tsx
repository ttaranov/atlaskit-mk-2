import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { BlockCard, InlineCard } from '@atlaskit/media-ui';
import { auth } from '@atlassian/outbound-auth-flow-client';
import { ObjectState, Client } from '../Client';
import { WithObject } from '../WithObject';
import { extractBlockPropsFromJSONLD } from '../extractBlockPropsFromJSONLD';
import { extractInlinePropsFromJSONLD } from '../extractInlinePropsFromJSONLD';

export type CardAppearance = 'inline' | 'block';

interface CardContentProps {
  appearance: CardAppearance;
  url: string;
  state: ObjectState;
  reload: () => void;
  onClick?: () => void;
}

class CardContent extends React.Component<CardContentProps> {
  // TODO: do we need to extract values differently per view?
  get collapsedIcon() {
    const { state } = this.props;
    const data = state.data || {};
    if (data.generator && data.generator.icon) {
      return data.generator.icon;
    } else {
      return undefined;
    }
  }

  handleFrameClick = () => {
    const { url, onClick } = this.props;
    if (onClick) {
      onClick();
    } else {
      window.open(url);
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
    return <BlockCard.ResolvingView onClick={this.handleFrameClick} />;
  }

  renderBlockUnauthorisedState() {
    const { url } = this.props;
    return (
      <BlockCard.UnauthorisedView
        icon={this.collapsedIcon}
        url={url}
        onClick={this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockForbiddenState() {
    const { url } = this.props;
    return (
      <BlockCard.ForbiddenView
        url={url}
        onClick={this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderBlockNotFoundState() {
    const { url } = this.props;
    return (
      <BlockCard.ErroredView
        url={url}
        message="We couldn't find this link"
        onClick={this.handleFrameClick}
      />
    );
  }

  renderBlockErroredState() {
    const { url } = this.props;
    return (
      <BlockCard.ErroredView
        url={url}
        message="We couldn't load this link"
        onClick={this.handleFrameClick}
        onRetry={this.handleErrorRetry}
      />
    );
  }

  renderBlockResolvedState() {
    const { state } = this.props;
    const props = extractBlockPropsFromJSONLD(state.data || {});
    return (
      <BlockCard.ResolvedView {...props} onClick={this.handleFrameClick} />
    );
  }

  renderBlockCard() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderBlockResolvingState();

      case 'resolved':
        return this.renderBlockResolvedState();

      case 'unauthorised':
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
    const { url } = this.props;
    return <InlineCard.LinkView text={url} onClick={this.handleFrameClick} />;
  }

  renderInlineResolvedState() {
    const { state } = this.props;
    const props = extractInlinePropsFromJSONLD(state.data || {});
    return (
      <InlineCard.ResolvedView {...props} onClick={this.handleFrameClick} />
    );
  }

  renderInlineUnauthorisedState() {
    return null;
  }

  renderInlineForbiddenState() {
    return null;
  }

  renderInlineNotFoundState() {
    return null;
  }

  renderInlineErroredState() {
    const { url } = this.props;
    return <InlineCard.LinkView text={url} />;
  }

  renderInlineCard() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderInlineResolvingState();

      case 'resolved':
        return this.renderInlineResolvedState();

      case 'unauthorised':
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

export interface CardProps {
  client?: Client;
  url: string;
  appearance?: CardAppearance;
}

export class Card extends React.PureComponent<CardProps> {
  render() {
    const { client, appearance = 'block', url } = this.props;
    return (
      <LazyRender
        offset={100}
        placeholder={<BlockCard.ResolvingView />}
        content={
          <WithObject client={client} url={url}>
            {({ state, reload }) => (
              <CardContent
                appearance={appearance}
                url={url}
                state={state}
                reload={reload}
              />
            )}
          </WithObject>
        }
      />
    );
  }
}
