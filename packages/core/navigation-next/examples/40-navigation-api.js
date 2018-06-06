// @flow

import React, { Component, Fragment } from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { Label } from '@atlaskit/field-base';
import Toggle from '@atlaskit/toggle';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import {
  ContainerViewSubscriber,
  getContainerViewState,
  getRootViewState,
  GlobalNav,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  NavRenderer,
  RootViewSubscriber,
} from '../src';

import {
  globalNavPrimaryItems,
  globalNavSecondaryItems,
  containerViews,
  rootViews,
} from './shared/mock-data';
import ShortcutsPlugin from './shared/shortcuts-plugin';

const gridSize = gridSizeFn();

/**
 * Render components
 */
const GlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

const JiraWordmark = () => (
  <div css={{ padding: `${gridSize * 2}px 0` }}>
    <JiraWordmarkLogo />
  </div>
);

const ProjectSwitcher = ({ components: C, ...props }: *) => (
  <div css={{ paddingBottom: `${gridSize}px` }}>
    <C.ContainerHeader
      before={itemState => (
        <ItemAvatar itemState={itemState} appearance="square" />
      )}
      {...props}
    />
  </div>
);

const ViewRenderer = ({ view }: *) => {
  const { activeView, data } = view.state;
  return activeView && data ? (
    <div css={{ padding: `${gridSize * 2}px 0` }}>
      <NavRenderer
        customComponents={{ JiraWordmark, ProjectSwitcher }}
        items={data}
      />
    </div>
  ) : (
    'LOADING'
  );
};

const ProductRoot = () => (
  <RootViewSubscriber>
    {rootView => <ViewRenderer view={rootView} />}
  </RootViewSubscriber>
);

const ProductContainer = () => (
  <ContainerViewSubscriber>
    {containerView => <ViewRenderer view={containerView} />}
  </ContainerViewSubscriber>
);

class Example extends Component<*> {
  componentDidMount() {
    const { containerView, rootView } = this.props;

    const containerViewKeys = Object.keys(containerViews);
    const rootViewKeys = Object.keys(rootViews);

    containerViewKeys.forEach(key => {
      containerView.addView(key, () => containerViews[key]);
    });

    rootViewKeys.forEach(key => {
      rootView.addView(key, () => rootViews[key]);
    });

    rootView.setView(rootViewKeys[0]);
    containerView.setView(containerViewKeys[0]);
  }

  render() {
    const { onDebugToggle } = this.props;
    return (
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productRootNavigation={ProductRoot}
        productContainerNavigation={ProductContainer}
      >
        <div style={{ padding: 30 }}>Page content</div>
        <Label label="Toggle debug logger" />
        <Toggle isDefaultChecked onChange={onDebugToggle} />
      </LayoutManager>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default class extends Component<*, *> {
  state = {
    debugEnabled: true,
  };

  toggleDebug = () => {
    this.setState({
      debugEnabled: !this.state.debugEnabled,
    });
  };

  render() {
    const { debugEnabled } = this.state;
    return (
      <NavigationProvider debug={debugEnabled}>
        <Fragment>
          <Example
            containerView={getContainerViewState()}
            rootView={getRootViewState()}
            onDebugToggle={this.toggleDebug}
          />
          <ShortcutsPlugin />
        </Fragment>
      </NavigationProvider>
    );
  }
}
