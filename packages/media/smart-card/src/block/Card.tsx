import * as React from 'react';
import * as PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';
import { ErrorCard } from '@atlaskit/media-ui';
import { Client } from '../Client';
import { extractPropsFromJSONLD } from './extractPropsFromJSONLD';
import { CardView, CardViewProps, minWidth, maxWidth } from './CardView';

export const LoadingView = () => null;

export const LoadedView = CardView;

export const ErroredView = () => (
  <ErrorCard
    hasPreview={false}
    minWidth={minWidth()}
    maxWidth={maxWidth({ hasPreview: false })}
  />
);

export interface CardProps {
  client?: Client;
  url: string;
}

export interface CardContext {
  smartCardClient?: Client;
}

export interface CardState {
  status: 'loading' | 'loaded' | 'errored';
  data?: CardViewProps;
}

function getLoadingState(): Pick<CardState, 'status' | 'data'> {
  return {
    status: 'loading',
    data: undefined,
  };
}

function getLoadedState(
  data: CardViewProps,
): Pick<CardState, 'status' | 'data'> {
  return {
    status: 'loaded',
    data,
  };
}

function getErroredState(): Pick<CardState, 'status'> {
  return {
    status: 'errored',
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

  async loadData() {
    let client;
    try {
      client = this.getClient();
    } catch (error) {
      // report the error for consumers to fix
      // tslint:disable-next-line:no-console
      console.error(error.message);
      this.setState(getErroredState());
      return;
    }

    try {
      const { url } = this.props;
      const json = await client.get(url);
      this.setState(getLoadedState(extractPropsFromJSONLD(json.data)));
    } catch (error) {
      // swallow the error and show a generic error message
      this.setState(getErroredState());
    }
  }

  handleRender = () => {
    this.loadData();
  };

  componentWillReceiveProps(nextProps: CardProps) {
    if (this.shouldFetch(this.props, nextProps)) {
      this.setState(getLoadingState());
    }
  }

  componentDidUpdate(prevProps: CardProps) {
    if (this.shouldFetch(prevProps, this.props)) {
      this.loadData();
    }
  }

  renderLoadedState() {
    const { data } = this.state;
    if (data) {
      return <LoadedView {...data} />;
    } else {
      return <ErroredView />;
    }
  }

  render() {
    const { status } = this.state;

    let content;
    switch (status) {
      case 'loading':
        content = <LoadingView />;
        break;
      case 'loaded':
        content = this.renderLoadedState();
        break;
      case 'errored':
        content = <ErroredView />;
        break;
    }

    return (
      <LazyRender
        offset={100}
        placeholder={<LoadingView />}
        content={content}
        onRender={this.handleRender}
      />
    );
  }
}
