import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Client } from './Client';

export interface SmartCardProviderProps {
  client?: Client;
  children: React.ReactElement<any>;
}

export class Provider extends React.Component<SmartCardProviderProps> {
  static childContextTypes = {
    smartCardClient: PropTypes.object,
  };

  client: Client;

  constructor(props: SmartCardProviderProps) {
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
