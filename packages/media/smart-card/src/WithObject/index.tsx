import * as React from 'react';
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
  state: InnerWithObjectState = {
    state: {
      status: 'resolving',
      services: [],
    },
  };

  reload = () => {
    const { client, url } = this.props;
    const {
      state: { definitionId },
    } = this.state;
    console.log('CARD: reload: %s using %s', url, definitionId);
    client.reload(url, definitionId);
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
    const { client, url } = this.props;
    const {
      state: { definitionId },
    } = this.state;
    client
      .register(url, state => this.setState({ state }))
      .get(url, definitionId);
  }

  // componentDidUpdate(prevProps: InnerWithObjectProps) {
  //   if (
  //     this.props.client !== prevProps.client ||
  //     this.props.url !== prevProps.url
  //   ) {
  //     this.subscribe();
  //   }
  // }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

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
