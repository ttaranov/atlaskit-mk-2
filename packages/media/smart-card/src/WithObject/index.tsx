import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';
import Context from '../Context';
import { Client, ObjectState } from '../Client';

export interface WithObjectRenderProps {
  state: ObjectState;
  reload: () => void;
}

interface InnerWithObjectProps {
  client: Client;
  url: string;
  children: (props: WithObjectRenderProps) => React.ReactNode;
}

interface InnerWithObjectState {
  prevClient?: Client;
  prevUrl?: string;
  state: ObjectState;
}

class InnerWithObject extends React.Component<
  InnerWithObjectProps,
  InnerWithObjectState
> {
  private subscription?: Subscription;

  state: InnerWithObjectState = {
    state: {
      status: 'resolving',
      services: [],
    },
  };

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  subscribe() {
    const { client, url } = this.props;
    const subscription = client.get(url).subscribe(state =>
      this.setState({
        state,
      }),
    );

    this.subscription = subscription;
  }

  reload = () => {
    const { client } = this.props;
    const { state } = this.state;
    if (state && state.provider) {
      client.reload(state.provider);
    }
  };

  static getDerivedStateFromProps(
    nextProps: InnerWithObjectProps,
    prevState: InnerWithObjectState,
  ) {
    if (
      nextProps.client !== prevState.prevClient ||
      nextProps.url !== prevState.prevUrl
    ) {
      return {
        state: {
          status: 'resolving',
        },
        prevClient: nextProps.client,
        prevUrl: nextProps.url,
      };
    }
    return null;
  }

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps: InnerWithObjectProps) {
    if (
      this.props.client !== prevProps.client ||
      this.props.url !== prevProps.url
    ) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { children } = this.props;
    const { state } = this.state;
    return children({ state, reload: this.reload });
  }
}

export interface WithObjectProps {
  client?: Client;
  url: string;
  children: (props: WithObjectRenderProps) => React.ReactNode;
}

export function WithObject(props: WithObjectProps) {
  const { client: clientFromProps, url, children } = props;
  return (
    <Context.Consumer>
      {clientFromContext => {
        const client = clientFromProps || clientFromContext;
        if (!client) {
          throw new Error(
            '@atlaskit/smart-card: No client provided. Provide a client like <Card client={new Client()} url=""/> or <Provider client={new Client()}><Card url=""/></Provider>.',
          );
        }
        return (
          <InnerWithObject client={client} url={url}>
            {children}
          </InnerWithObject>
        );
      }}
    </Context.Consumer>
  );
}
