// @flow

import React, { Component } from 'react';
import { RootViewSubscriber } from '../../../../../src';
import MoreSettingsProvider from '../../../../../../global-navigation/node_modules/@atlaskit/navigation-next/examples/ref-app/providers/more-settings-provider';

const getItems = moreSettingsState => [
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
      { id: 'back', type: 'LinkItem', text: 'Back to home', to: '/' },
      { id: 'settings-title', type: 'Title', text: 'Settings' },
      { id: 'theme-settings', type: 'Item', text: 'Theme settings' },
      ...(moreSettingsState.data
        ? moreSettingsState.data
        : [{ id: 'loading', type: 'Item', text: 'LOADING' }]),
    ],
  },
];

class RootSettingsView extends Component<{
  rootView: *,
  moreSettingsState: *,
}> {
  componentDidMount() {
    const { rootView, moreSettingsState } = this.props;
    rootView.addView('root/settings', () => getItems(moreSettingsState));
  }
  componentDidUpdate(prevProps) {
    const { moreSettingsState, rootView } = this.props;
    if (prevProps.moreSettingsState.data !== moreSettingsState.data) {
      rootView.addView('root/settings', () => getItems(moreSettingsState));
    }
  }
  render() {
    return null;
  }
}

export default () => (
  <MoreSettingsProvider>
    {moreSettingsState => (
      <RootViewSubscriber>
        {rootView => (
          <RootSettingsView
            rootView={rootView}
            moreSettingsState={moreSettingsState}
          />
        )}
      </RootViewSubscriber>
    )}
  </MoreSettingsProvider>
);
