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
export default class GlobalNavigationWtihLDConfig extends Component<
  Object,
  State,
> {
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

  switchUser = (user: number) => {
    this.setState({
      userConfig: this.userConfigs[user],
    });
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => <Global userConfig={this.state.userConfig} />}
          productRootNavigation={() => null}
          productContainerNavigation={() => null}
        >
          <button onClick={() => this.switchUser(0)}>Jira User</button>
          <button onClick={() => this.switchUser(1)}>Confluence User</button>
          <button onClick={() => this.switchUser(2)}>Alice</button>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}

const Global = props => {
  console.log(props.userConfig);
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
      userConfig={props.userConfig}
    />
  );
};
