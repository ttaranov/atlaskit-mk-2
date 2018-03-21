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

  static defaultClient: Client = new Client();

  getChildContext() {
    return {
      smartCardClient: this.props.client || Provider.defaultClient,
    };
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
