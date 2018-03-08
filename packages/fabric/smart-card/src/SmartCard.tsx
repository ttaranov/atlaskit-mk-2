import * as React from 'react';
import * as PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';
import { AppCardModel } from '@atlaskit/media-card';
import { SmartCardClient } from './SmartCardClient';
import { SmartCardView } from './SmartCardView';

export const LoadingView = () => null;

export const LoadedView = SmartCardView;

// TODO: use link horizontal error view
export const ErroredView = () => <span>Error!</span>;

export interface SmartCardProps {
  client?: SmartCardClient;
  url: string;
}

export interface SmartCardContext {
  smartCardClient?: SmartCardClient;
}

export interface SmartCardState {
  status: 'loading' | 'loaded' | 'errored';
  data?: AppCardModel;
}

function loading(): Pick<SmartCardState, 'status' | 'data'> {
  return {
    status: 'loading',
    data: undefined,
  };
}

function loaded(data: AppCardModel): Pick<SmartCardState, 'status' | 'data'> {
  return {
    status: 'loaded',
    data,
  };
}

function errored(): Pick<SmartCardState, 'status'> {
  return {
    status: 'errored',
  };
}

export class SmartCard extends React.Component<SmartCardProps, SmartCardState> {
  static contextTypes = {
    smartCardClient: PropTypes.object,
  };

  context: SmartCardContext;

  state: SmartCardState = loading();

  get client(): SmartCardClient {
    const client = this.context.smartCardClient || this.props.client;
    if (!client) {
      console.error(
        'No client provided. Provide a client like <SmartCard client={new SmartCardClient()} url=""/> or <SmartCardProvider client={new SmartCardClient()}><SmartCard url=""/></SmartCardProvider>.',
      );
      throw new Error();
    }
    return client;
  }

  shouldFetch(prevProps: SmartCardProps, nextProps: SmartCardProps) {
    return prevProps.url !== nextProps.url;
  }

  async fetch() {
    const { url } = this.props;
    try {
      const json = await this.client.fetch(url);
      this.setState(loaded(json.data as AppCardModel));
    } catch (error) {
      this.setState(errored());
    }
  }

  handleRender = () => {
    this.fetch();
  };

  componentWillReceiveProps(nextProps: SmartCardProps) {
    if (this.shouldFetch(this.props, nextProps)) {
      this.setState(loading());
    }
  }

  componentDidUpdate(prevProps: SmartCardProps) {
    if (this.shouldFetch(prevProps, this.props)) {
      this.fetch();
    }
  }

  renderLoaded() {
    const { data } = this.state;
    if (data) {
      return <LoadedView newDesign={true} model={data} />;
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
