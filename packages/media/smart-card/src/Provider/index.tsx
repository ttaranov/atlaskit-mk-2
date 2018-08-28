import * as React from 'react';
import Context from '../Context';
import { Client } from '../Client';

export interface ProviderProps {
  client?: Client;
  children: React.ReactElement<any>;
}

export class Provider extends React.Component<ProviderProps> {
  static defaultClient: Client = new Client();

  render() {
    const { client, children } = this.props;
    return (
      <Context.Provider value={client || Provider.defaultClient}>
        {children}
      </Context.Provider>
    );
  }
}
