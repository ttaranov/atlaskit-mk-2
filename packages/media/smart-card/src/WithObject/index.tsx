import * as React from 'react';
import Context from '../Context';
import { Client, ObjectState } from '../Client';
import { v4 } from 'uuid';
import { Provider } from '../Provider';

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
  uuid: string;
}

class InnerWithObject extends React.Component<
  InnerWithObjectProps,
  InnerWithObjectState
> {
  state: InnerWithObjectState = {
    uuid: v4(),
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
          definitionId: prevState.state.definitionId,
        },
        prevClient: nextProps.client,
        prevUrl: nextProps.url,
      };
    }
    return null;
  }

  componentDidMount() {
    const { client, url } = this.props;
    const { uuid } = this.state;
    const {
      state: { definitionId },
    } = this.state;
    client.register(url, uuid, this.updateState).resolve(url, definitionId);
  }

  updateState = (state: ObjectState) => {
    this.setState({ state });
  };

  componentDidUpdate(prevProps: InnerWithObjectProps) {
    const { client, url } = this.props;
    const { uuid } = this.state;
    if (this.props.client !== prevProps.client) {
      prevProps.client.deregister(prevProps.url, uuid);
      client.register(url, uuid, this.updateState).resolve(url);
    }
    if (this.props.url !== prevProps.url) {
      client
        .deregister(prevProps.url, uuid)
        .register(url, uuid, this.updateState)
        .resolve(url);
    }
    return;
  }

  componentWillUnmount() {
    const { client, url } = this.props;
    const { uuid } = this.state;

    client.deregister(url, uuid);
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
        // TODO: Remove the last fallback - this is a temporary workaround for React context not penetrating the <Editor />
        //       https://product-fabric.atlassian.net/browse/ED-5565
        const client =
          clientFromProps || clientFromContext || Provider.defaultClient;
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
