import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { BlockCard } from '@atlaskit/media-ui';
import { auth } from '@atlassian/outbound-auth-flow-client';
import { ObjectState, Client } from '../Client';
import { WithObject } from '../WithObject';
import { extractBlockPropsFromJSONLD } from '../extractBlockPropsFromJSONLD';

export type CardAppearance = 'inline' | 'block';

interface CardContentProps {
  appearance: CardAppearance;
  url: string;
  state: ObjectState;
  reload: () => void;
  onClick?: () => void;
}

class CardContent extends React.Component<CardContentProps> {
  extractViewProps() {
    const { state } = this.props;
    return extractBlockPropsFromJSONLD(state.data || {});
  }

  get collapsedIcon() {
    const props = this.extractViewProps();
    return (
      (props && props.icon && props.icon.url) ||
      (props && props.context && props.context.icon)
    );
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

  renderResolvingState() {
    return <BlockCard.ResolvingView onClick={this.handleFrameClick} />;
  }

  renderUnauthorisedState() {
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

  renderForbiddenState() {
    const { url } = this.props;
    return (
      <BlockCard.ForbiddenView
        url={url}
        onClick={this.handleFrameClick}
        onAuthorise={this.handleAuthorise}
      />
    );
  }

  renderNotFoundState() {
    const { url } = this.props;
    return (
      <BlockCard.ErroredView
        url={url}
        message="We couldn't find this link"
        onClick={this.handleFrameClick}
      />
    );
  }

  renderErroredState() {
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

  renderResolvedState() {
    const props = this.extractViewProps();
    return (
      <BlockCard.ResolvedView {...props} onClick={this.handleFrameClick} />
    );
  }

  render() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderResolvingState();

      case 'resolved':
        return this.renderResolvedState();

      case 'unauthorised':
        return this.renderUnauthorisedState();

      case 'forbidden':
        return this.renderForbiddenState();

      case 'not-found':
        return this.renderNotFoundState();

      case 'errored':
        return this.renderErroredState();
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
