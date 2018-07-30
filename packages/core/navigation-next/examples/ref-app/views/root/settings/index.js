// @flow

import React, { Component } from 'react';
import { ViewControllerSubscriber } from '../../../../../src';
import MoreSettingsProvider from '../../../../../../global-navigation/node_modules/@atlaskit/navigation-next/examples/ref-app/providers/more-settings-provider';

const getItems = moreSettingsState => () => {
  const settingsData = moreSettingsState.data
    ? moreSettingsState.data
    : [{ id: 'loading', type: 'Item', text: 'LOADING' }];

  return [
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
        { id: 'settings-title', type: 'GroupHeading', text: 'Settings' },
        { id: 'theme-settings', type: 'Item', text: 'Theme settings' },
        ...settingsData,
      ],
    },
  ];
};

class RootSettingsView extends Component<{
  navigationViewController: *,
  moreSettingsState: *,
}> {
  componentDidMount() {
    const { navigationViewController, moreSettingsState } = this.props;
    navigationViewController.addView({
      id: 'root/settings',
      getItems: getItems(moreSettingsState),
      type: 'product',
    });
  }
  componentDidUpdate(prevProps) {
    const { moreSettingsState, navigationViewController } = this.props;
    if (prevProps.moreSettingsState.data !== moreSettingsState.data) {
      navigationViewController.addView({
        id: 'root/settings',
        getItems: getItems(moreSettingsState),
        type: 'product',
      });
    }
  }
  render() {
    return null;
  }
}

export default () => (
  <MoreSettingsProvider>
    {moreSettingsState => (
      <ViewControllerSubscriber>
        {navigationViewController => (
          <RootSettingsView
            navigationViewController={navigationViewController}
            moreSettingsState={moreSettingsState}
          />
        )}
      </ViewControllerSubscriber>
    )}
  </MoreSettingsProvider>
);
