// @flow

import React, { Component } from 'react';
import { RootViewSubscriber } from '../../../../../src';

const getItems = () => [
  {
    type: 'Group',
    id: 'header',
    items: [
      {
        type: 'Wordmark',
        id: 'wordmark',
      },
    ],
  },
  {
    type: 'Group',
    id: 'menu',
    items: [
      { id: 'back', type: 'BackItem', text: 'Back to home', goTo: 'root/home' },
      { id: 'settings-title', type: 'Title', text: 'Settings' },
      { id: 'theme-settings', type: 'Item', text: 'Theme settings' },
    ],
  },
];

class RootSettingsView extends Component<{ rootView: * }> {
  componentDidMount() {
    this.props.rootView.addView('root/settings', getItems);
  }
  render() {
    return null;
  }
}

export default () => (
  <RootViewSubscriber>
    {rootView => <RootSettingsView rootView={rootView} />}
  </RootViewSubscriber>
);
