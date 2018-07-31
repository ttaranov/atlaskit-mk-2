// @flow

import { Component } from 'react';
import { withNavigationViewController } from '../../../../../src';

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
      { id: 'projects', type: 'LinkItem', text: 'Projects', to: '/projects' },
      { id: 'settings', type: 'LinkItem', text: 'Settings', to: '/settings' },
    ],
  },
];

class RootHomeView extends Component<*> {
  componentDidMount() {
    this.props.navigationViewController.addView({
      id: 'root/home',
      type: 'product',
      getItems,
    });
  }

  render() {
    return null;
  }
}

export default withNavigationViewController(RootHomeView);
