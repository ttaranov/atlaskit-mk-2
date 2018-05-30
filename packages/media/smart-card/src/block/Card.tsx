import * as React from 'react';
import * as PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';
import { auth } from '@atlassian/outbound-auth-flow-client';
import { Client } from '../Client';
import { extractPropsFromJSONLD } from './extractPropsFromJSONLD';
import { CardView, CardViewProps, minWidth, maxWidth } from './CardView';
import { Frame as CollapsedFrame } from './collapsed/Frame';
import { LoadingView as CollapsedLoadingView } from './collapsed/LoadingView';
import { UnauthorisedView as CollapsedUnauthorisedView } from './collapsed/UnauthorisedView';
import { ForbiddenView as CollapsedForbiddenView } from './collapsed/ForbiddenView';
import { ErroredView as CollapsedErrorView } from './collapsed/ErroredView';
import {
  ObjectStateProvider,
  ObjectService,
  ObjectStatus,
} from '../Client/ObjectStateProvider';
import { Subscription } from 'rxjs/Subscription';

export interface CardProps {
  client?: Client;
  url: string;
  onClick?: () => void;
}

export interface CardContext {
  smartCardClient?: Client;
}

export interface CardState {
  status: ObjectStatus;
  services: ObjectService[];
  props?: CardViewProps;
}
export class Card extends React.Component<CardProps, CardState> {
  static contextTypes = {
    smartCardClient: PropTypes.object,
  };

  private provider?: ObjectStateProvider;
  private subscription?: Subscription;

  context: CardContext;

  state: CardState = {
    status: 'resolving',
    services: [],
  };

  getClient(): Client {
    const client = this.context.smartCardClient || this.props.client;
    if (!client) {
      throw new Error(
        '@atlaskit/smart-card: No client provided. Provide a client like <Card client={new Client()} url=""/> or <Provider client={new Client()}><Card url=""/></Provider>.',
      );
    }
    return client;
  }

  shouldFetch(prevProps: CardProps, nextProps: CardProps) {
    return prevProps.url !== nextProps.url;
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.provider = undefined;
      this.subscription = undefined;
    }
  }

  subscribe() {
    let client;
    try {
      client = this.getClient();
    } catch (error) {
      // report the error for consumers to fix
      // tslint:disable-next-line:no-console
      console.error(error.message);
      this.setState({ status: 'errored' });
      return;
    }

    const { url } = this.props;
    const provider = client.get(url);
    const subscription = provider
      .observable()
      .subscribe(({ status, services, data }) =>
        this.setState({
          status,
          services,
          props: data ? extractPropsFromJSONLD(data) : undefined,
        }),
      );

    this.provider = provider;
    this.subscription = subscription;
  }

  refresh() {
    if (this.provider) {
      this.provider.refresh();
    }
  }

  get collapsedIcon() {
    const { props } = this.state;
    return (
      (props && props.icon && props.icon.url) ||
      (props && props.context && props.context.icon)
    );
  }

  // we don't fetch the props on mount, but when the card is scrolled into view
  handleLazilyRender = () => {
    this.subscribe();
  };

  handleFrameClick = () => {
    const { url, onClick } = this.props;
    if (onClick) {
      onClick();
    } else {
      window.open(url);
    }
  };

  handleAuthorise = (service: ObjectService) => {
    auth(service.startAuthUrl).then(() => this.refresh(), () => this.refresh());
  };

  handleErrorRetry = () => {
    this.refresh();
  };

  componentWillReceiveProps(nextProps: CardProps) {
    if (this.shouldFetch(this.props, nextProps)) {
      // TODO: check we're not causing cascading updates
      this.setState({ status: 'resolving' });
    }
  }

  componentDidUpdate(prevProps: CardProps) {
    if (this.shouldFetch(prevProps, this.props)) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderInTheCollapsedFrame(children: React.ReactNode) {
    return (
      <CollapsedFrame
        minWidth={minWidth()}
        maxWidth={maxWidth({ hasPreview: false })}
        onClick={this.handleFrameClick}
      >
        {children}
      </CollapsedFrame>
    );
  }

  renderResolvingState() {
    return this.renderInTheCollapsedFrame(<CollapsedLoadingView />);
  }

  renderUnauthorisedState() {
    // TODO: figure out how to support multiple services
    const service = this.state.services[0];
    return this.renderInTheCollapsedFrame(
      <CollapsedUnauthorisedView
        icon={this.collapsedIcon}
        service={service ? service.name : ''}
        onAuthorise={service ? () => this.handleAuthorise(service) : undefined}
      />,
    );
  }

  renderForbiddenState() {
    // TODO: figure out how to support multiple services
    const service = this.state.services[0];
    return this.renderInTheCollapsedFrame(
      <CollapsedForbiddenView
        icon={this.collapsedIcon}
        onAuthorise={service ? () => this.handleAuthorise(service) : undefined}
      />,
    );
  }

  renderNotFoundState() {
    return this.renderInTheCollapsedFrame(
      <CollapsedErrorView message="We couldn't find this link" />,
    );
  }

  renderErroredState() {
    return this.renderInTheCollapsedFrame(
      <CollapsedErrorView
        message="We couldn't load this link"
        onRetry={this.handleErrorRetry}
      />,
    );
  }

  renderResolvedState() {
    const { props } = this.state;
    return <CardView {...props} />;
  }

  renderContent() {
    const { status } = this.state;
    switch (status) {
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

  render() {
    return (
      <LazyRender
        offset={100}
        placeholder={this.renderResolvingState()}
        content={this.renderContent()}
        onRender={this.handleLazilyRender}
      />
    );
  }
}
