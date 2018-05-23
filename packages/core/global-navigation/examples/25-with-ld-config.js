// @flow

import React, { Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import type { UserConfig } from '../src';
import GlobalNavigation from '../src/components/GlobalNavigation';

type State = {
  userConfig: UserConfig,
};
export default class GlobalNavigationWtihLDConfig extends Component<
  Object,
  State,
> {
  userConfigs = [
    {
      key: 'defaultUser@example.com',
      custom: {
        product: 'JIRA',
      },
    },
    {
      key: 'jiraUser@example.com',
      custom: {
        product: 'jira',
      },
    },
    {
      key: 'confluenceUser@example.com',
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
    userConfig: this.userConfigs[
      window.sessionStorage.getItem('currentUserId') || 0
    ],
  };

  // The LaunchDarkly components loads new user config on page load.
  switchUser = (userId: number) => {
    window.sessionStorage.setItem('currentUserId', userId);
    window.location.reload();
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => <Global userConfig={this.state.userConfig} />}
          productRootNavigation={() => null}
          productContainerNavigation={() => null}
        >
          <button onClick={() => this.switchUser(0)}>Default User</button>
          <button onClick={() => this.switchUser(1)}>Jira User</button>
          <button onClick={() => this.switchUser(2)}>Confluence User</button>
          <button onClick={() => this.switchUser(3)}>Alice</button>
          <div>{`Current User: ${this.state.userConfig.key}`}</div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}

const Global = ({ userConfig }: { userConfig: * }) => {
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
      userConfig={userConfig}
    />
  );
};
