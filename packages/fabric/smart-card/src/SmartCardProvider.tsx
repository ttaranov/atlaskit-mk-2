import * as React from 'react';
import * as PropTypes from 'prop-types';
import { SmartCardClient } from './SmartCardClient';

export interface SmartCardProviderProps {
  client: SmartCardClient;
  children: React.ReactElement<any>;
}

export class SmartCardProvider extends React.Component<SmartCardProviderProps> {
  static childContextTypes = {
    smartCardClient: PropTypes.object,
  };

  getChildContext() {
    const { client } = this.props;
    return {
      smartCardClient: client,
    };
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
