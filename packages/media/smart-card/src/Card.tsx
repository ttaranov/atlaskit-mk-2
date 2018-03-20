import * as React from 'react';
import * as PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';
import { ErrorCard } from '@atlaskit/media-ui';
import { Client } from './Client';
import { convert } from './convert';
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

function loading(): Pick<CardState, 'status' | 'data'> {
  return {
    status: 'loading',
    data: undefined,
  };
}

function loaded(data: CardViewProps): Pick<CardState, 'status' | 'data'> {
  return {
    status: 'loaded',
    data,
  };
}

function errored(): Pick<CardState, 'status'> {
  return {
    status: 'errored',
  };
}

export class Card extends React.Component<CardProps, CardState> {
  static contextTypes = {
    smartCardClient: PropTypes.object,
  };

  context: CardContext;

  state: CardState = loading();

  get client(): Client {
    const client = this.context.smartCardClient || this.props.client;
    if (!client) {
      // tslint:disable-next-line:no-console
      console.error(
        '@atlaskit/smart-card: No client provided. Provide a client like <Card client={new Client()} url=""/> or <Provider client={new Client()}><Card url=""/></Provider>.',
      );
      throw new Error();
    }
    return client;
  }

  shouldFetch(prevProps: CardProps, nextProps: CardProps) {
    return prevProps.url !== nextProps.url;
  }

  async load() {
    const { url } = this.props;
    try {
      const json = await this.client.get(url);
      this.setState(loaded(convert(json.data)));
    } catch (error) {
      this.setState(errored());
    }
  }

  handleRender = () => {
    this.load();
  };

  componentWillReceiveProps(nextProps: CardProps) {
    if (this.shouldFetch(this.props, nextProps)) {
      this.setState(loading());
    }
  }

  componentDidUpdate(prevProps: CardProps) {
    if (this.shouldFetch(prevProps, this.props)) {
      this.load();
    }
  }

  renderLoaded() {
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
        content = this.renderLoaded();
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
