import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Client } from './Client';
export interface ProviderProps {
  client?: Client;
  children: React.ReactElement<any>;
}

export class Provider extends React.Component<ProviderProps> {
  static childContextTypes = {
    smartCardClient: PropTypes.object,
  };

  client: Client;

  constructor(props: ProviderProps) {
    super(props);
    this.client = props.client || new Client();
  }

  getChildContext() {
    return {
      smartCardClient: this.props.client || this.client,
    };
  }

  componentWillReceiveProps(nextProps: ProviderProps) {
    const { client: prevClient } = this.props;
    const { client: nextClient } = nextProps;
    if (nextClient !== prevClient) {
      this.client = nextProps.client || new Client();
    }
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
