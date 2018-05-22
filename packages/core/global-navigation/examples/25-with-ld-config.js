// @flow

import React, { Component } from 'react';
import { LaunchDarkly, FeatureFlag } from 'react-launch-darkly';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import type { UserConfig } from '../src';
import GlobalNavigation from '../src/components/GlobalNavigation';

type State = {
  userConfig: UserConfig,
};
class GlobalNavigationWtihLDConfig extends Component<Object, State> {
  userConfigs = [
    {
      key: 'bob@example.com',
      custom: {
        product: 'jira',
      },
    },
    {
      key: 'bob@example.com',
      custom: {
        product: 'confluence',
      },
    },
    {
      key: 'alice@example.com',
      custom: {
        product: 'jira',
      },
    },
  ];
  state: State = {
    userConfig: this.userConfigs[0],
  };

  render() {
    return (
      <GlobalNavigation
        product={{
          label: 'Jira',
          icon: EmojiAtlassianIcon,
        }}
        search={{}}
        create={{}}
        people={{}}
        notification={{}}
        appSwitcher={{}}
        help={{}}
        profile={{}}
        userConfig={this.state.userConfig}
      />
    );
  }
}

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={GlobalNavigationWtihLDConfig}
      productRootNavigation={() => null}
      productContainerNavigation={() => null}
    >
      Page content
    </LayoutManager>
  </NavigationProvider>
);
