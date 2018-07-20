// @flow

import { Component } from 'react';
import {
  withNavigationViews,
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

type Props = { navigationViews: ViewStateInterface };
class RootHomeView extends Component<Props> {
  componentDidMount() {
    this.props.navigationViews.addView({
      id: 'root/home',
      type: 'product',
      getItems,
    });
  }

  render() {
    return null;
  }
}

export default withNavigationViews(RootHomeView);
