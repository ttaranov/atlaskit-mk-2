// @flow

import React, { Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src/components/GlobalNavigation';

const Global = ({ disablePeek }: { disablePeek: boolean }) => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: EmojiAtlassianIcon,
      disablePeek,
    }}
    search={{}}
    create={{}}
    people={{}}
    notification={{}}
    appSwitcher={{}}
    help={{}}
    profile={{}}
  />
);

type State = {
  disablePeek: boolean,
};
export default class GlobalNavigationWtihSpotLight extends Component<
  Object,
  State,
> {
  state = {
    disablePeek: false,
  };

  togglePeek = () => {
    this.setState(state => ({
      disablePeek: !state.disablePeek,
    }));
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => (
            <Global disablePeek={this.state.disablePeek} />
          )}
          productRootNavigation={() => null}
          productContainerNavigation={() => null}
        >
          <button onClick={this.togglePeek}>
            {`Peek ${this.state.disablePeek ? 'disabled' : 'enabled'}`}
          </button>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
