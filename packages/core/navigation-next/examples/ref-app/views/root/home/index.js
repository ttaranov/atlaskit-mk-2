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
      { id: 'projects', type: 'Item', text: 'Projects', goTo: 'root/projects' },
      { id: 'settings', type: 'Item', text: 'Settings', goTo: 'root/settings' },
    ],
  },
];

class RootHomeView extends Component<{ rootView: * }> {
  componentDidMount() {
    this.props.rootView.addView('root/home', getItems);
  }

  render() {
    return null;
  }
}

export default () => (
  <RootViewSubscriber>
    {rootView => <RootHomeView rootView={rootView} />}
  </RootViewSubscriber>
);
