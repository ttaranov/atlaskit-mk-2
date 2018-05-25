import * as React from 'react';
import * as PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';
import { Client } from '../Client';
import { extractPropsFromJSONLD } from './extractPropsFromJSONLD';
import { CardView, CardViewProps, minWidth, maxWidth } from './CardView';
import { Frame as CollapsedFrame } from './collapsed/Frame';
import { LoadingView as CollapsedLoadingView } from './collapsed/LoadingView';
import { UnauthorisedView as CollapsedUnauthorisedView } from './collapsed/UnauthorisedView';
import { ForbiddenView as CollapsedForbiddenView } from './collapsed/ForbiddenView';
import { ErroredView as CollapsedErrorView } from './collapsed/ErroredView';

export interface CardProps {
  client?: Client;
  url: string;
  onClick?: () => void;
}

export interface CardContext {
  smartCardClient?: Client;
}

export interface CardState {
  state:
    | 'loading'
    | 'resolved'
    | 'unauthorised'
    | 'forbidden'
    | 'not-found'
    | 'errored';
  props?: CardViewProps;
}

function getLoadingState(): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'loading',
    props: undefined,
  };
}

function getResolvedState(
  props: CardViewProps,
): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'resolved',
    props,
  };
}

function getUnauthorisedState(
  props: CardViewProps,
): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'unauthorised',
    props: props,
  };
}

function getForbiddenState(
  props: CardViewProps,
): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'forbidden',
    props: props,
  };
}

function getNotFoundState(): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'not-found',
    props: undefined,
  };
}

function getFailedState(): Pick<CardState, 'state' | 'props'> {
  return {
    state: 'errored',
    props: undefined,
  };
}

export class Card extends React.Component<CardProps, CardState> {
  static contextTypes = {
    smartCardClient: PropTypes.object,
  };

  context: CardContext;

  state: CardState = getLoadingState();

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

  async fetchProps() {
    let client;
    try {
      client = this.getClient();
    } catch (error) {
      // report the error for consumers to fix
      // tslint:disable-next-line:no-console
      console.error(error.message);
      this.setState(getFailedState());
      return;
    }

    try {
      const { url } = this.props;
      const json = await client.get(url);

      if (json === undefined) {
        this.setState(getNotFoundState());
        return;
      }

      const props = extractPropsFromJSONLD(json.data || {});

      switch (json.meta.access) {
        case 'forbidden':
          this.setState(getForbiddenState(props));
          break;

        case 'unauthorised':
          this.setState(getUnauthorisedState(props));
          break;

        default:
          this.setState(getResolvedState(props));
      }
    } catch (error) {
      // swallow the error and show a generic error message
      this.setState(getFailedState());
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
    this.fetchProps();
  };

  handleFrameClick = () => {
    const { url, onClick } = this.props;
    if (onClick) {
      onClick();
    } else {
      window.open(url);
    }
  };

  handleAuthorise = () => {
    window.open('http://example.com/');
    setTimeout(() => {
      this.setState(getLoadingState());
      this.fetchProps();
    }, 3000);
  };

  handleErrorRetry = () => {
    this.setState(getLoadingState());
    this.fetchProps();
  };

  componentWillReceiveProps(nextProps: CardProps) {
    if (this.shouldFetch(this.props, nextProps)) {
      this.setState(getLoadingState());
    }
  }

  componentDidUpdate(prevProps: CardProps) {
    if (this.shouldFetch(prevProps, this.props)) {
      this.fetchProps();
    }
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

  renderLoadingState() {
    return this.renderInTheCollapsedFrame(<CollapsedLoadingView />);
  }

  renderUnauthorisedState() {
    // TODO: extract the service name
    return this.renderInTheCollapsedFrame(
      <CollapsedUnauthorisedView
        icon={this.collapsedIcon}
        service="Google Drive"
        onAuthorise={this.handleAuthorise}
      />,
    );
  }

  renderForbiddenState() {
    return this.renderInTheCollapsedFrame(
      <CollapsedForbiddenView
        icon={this.collapsedIcon}
        onAuthorise={this.handleAuthorise}
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
    const { state } = this.state;
    switch (state) {
      case 'loading':
        return this.renderLoadingState();

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
        placeholder={this.renderLoadingState()}
        content={this.renderContent()}
        onRender={this.handleLazilyRender}
      />
    );
  }
}
