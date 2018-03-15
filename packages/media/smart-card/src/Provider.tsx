import * as React from 'react';
import { Client } from './Client';

export interface ProviderProps {
  client?: Client;
  children: React.ReactElement<any>;
}

export class Provider extends React.Component<ProviderProps> {
  client: Client;

  constructor(props: ProviderProps) {
    super(props);
    this.client = new Client();
  }

  getChildContext() {
    return {
      smartCardClient: this.props.client || this.client,
    };
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
