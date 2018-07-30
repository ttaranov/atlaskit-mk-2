// @flow

import { Component } from 'react';
import {
  withNavigationViewController,
  type ViewStateInterface,
} from '../../../../../src';

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

type Props = { navigationViewController: ViewStateInterface };
class RootHomeView extends Component<Props> {
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
