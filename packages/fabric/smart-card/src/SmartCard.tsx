import * as React from 'react';
import SmartCardView from './SmartCardView';
import { AppCardModel } from '@atlaskit/media-card';

export interface SmartCardProps {
  url: string;
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

export default class SmartCard extends React.Component<
  SmartCardProps,
  SmartCardState
> {
  shouldFetch(prevProps: SmartCardProps, nextProps: SmartCardProps) {
    return prevProps.url !== nextProps.url;
  }

  async fetch() {
    const { url } = this.props;
    try {
      const res = await fetch(
        'https://wt-34857ffa982ba1dd8c0b8b61fe8d2c53-0.sandbox.auth0-extend.com/trello-smartcard',
        {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
          },
          body: `{"resourceUrl": "${encodeURI(url)}"}`,
        },
      );
      const json = await res.json();
      this.setState(loaded(json.data as AppCardModel));
    } catch (error) {
      this.setState(errored());
    }
  }

  componentWillMount() {
    this.setState(loading());
  }

  componentDidMount() {
    this.fetch();
  }

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

  render() {
    const { status, data } = this.state;

    if (status === 'loaded' && data) {
      return <SmartCardView newDesign={true} model={data} />;
    }

    // I'm unsure of what the loading and errored states should look like
    return null;
  }
}
