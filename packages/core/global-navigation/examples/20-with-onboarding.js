// @flow

import React, { Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import QuestionCircle from '@atlaskit/icon/glyph/question';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import {
  LayoutManager,
  NavigationProvider,
  light,
} from '@atlaskit/navigation-next';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
} from '@atlaskit/onboarding';
import Lorem from 'react-lorem-component';

import GlobalNavigation from '../src/components/GlobalNavigation';
import { withTheme } from '../src/theme';

const Global = () => (
  <GlobalNavigation
    product={{
      icon: () => (
        <SpotlightTarget name="product">
          <EmojiAtlassianIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'product',
    }}
    search={{
      icon: () => (
        <SpotlightTarget name="search">
          <SearchIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'search',
    }}
    create={{
      icon: () => (
        <SpotlightTarget name="create">
          <CreateIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'create',
    }}
    people={{
      icon: () => (
        <SpotlightTarget name="people">
          <PeopleIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'people',
    }}
    notification={{
      icon: () => (
        <SpotlightTarget name="notification">
          <NotificationIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'notification',
    }}
    appSwitcher={{
      icon: () => (
        <SpotlightTarget name="appSwitcher">
          <MenuIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'appSwitcher',
    }}
    help={{
      icon: () => (
        <SpotlightTarget name="help">
          <QuestionCircle primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'help',
    }}
    profile={{
      icon: () => (
        <SpotlightTarget name="profile">
          <PeopleIcon primaryColor="#DEEBFF" />
        </SpotlightTarget>
      ),
      label: 'profile',
    }}
  />
);

type State = {
  active: number | null,
};

class GlobalNavigationWtihSpotLight extends Component<Object, State> {
  state: State = { active: null };
  start = () => this.setState({ active: 0 });
  next = () => this.setState(state => ({ active: (state.active || 0) + 1 }));
  prev = () => this.setState(state => ({ active: (state.active || 0) - 1 }));
  finish = () => this.setState({ active: null });

  renderActiveSpotLight = () => {
    const variants = [
      <Spotlight
        actions={[
          { onClick: this.finish, text: 'Some other time' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom left"
        heading="Product Icon"
        key="product"
        target="product"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom center"
        heading="Search Icon"
        key="search"
        target="search"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom right"
        heading="Create Icon"
        key="create"
        target="create"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom right"
        heading="Notification Icon"
        key="notification"
        target="notification"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom right"
        heading="People Icon"
        key="people"
        target="people"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom right"
        heading="App Switcher Icon"
        key="appSwitcher"
        target="appSwitcher"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom right"
        heading="Help Icon"
        key="help"
        target="help"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
      <Spotlight
        actions={[{ onClick: this.finish, text: 'Got it' }]}
        dialogPlacement="bottom right"
        heading="Profile Icon"
        key="profile"
        target="profile"
        targetRadius={999}
      >
        <Lorem count={3} />
      </Spotlight>,
    ];

    if (this.state.active == null) return null;

    return variants[this.state.active];
  };

  render() {
    return (
      <SpotlightManager>
        <NavigationProvider>
          <LayoutManager
            globalNavigation={Global}
            productRootNavigation={() => null}
            productContainerNavigation={() => null}
          >
            <button onClick={this.start}>Start Onboarding</button>
            {this.renderActiveSpotLight()}
          </LayoutManager>
        </NavigationProvider>
      </SpotlightManager>
    );
  }
}

export default withTheme({ mode: light, context: 'expanded' })(
  GlobalNavigationWtihSpotLight,
);
