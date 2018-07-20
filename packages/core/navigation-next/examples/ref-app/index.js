// @flow

import React, { Component } from 'react';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { AtlassianWordmark } from '@atlaskit/logo';
import {
  Item,
  LayoutManager,
  NavigationProvider,
  UIStateSubscriber,
  ViewRenderer,
  ViewStateSubscriber,
} from '../../src';

import ContainerViews from './views/container';
import RootViews from './views/root';
import { ProjectSwitcher } from './pages/components';
import { HomePage, ProjectPage, ProjectsPage, SettingsPage } from './pages';

const MyGlobalNavigation = () => (
  <UIStateSubscriber>
    {({ togglePeek }) => (
      <GlobalNavigation
        productIcon={AtlassianIcon}
        onProductClick={togglePeek}
      />
    )}
  </UIStateSubscriber>
);
const ProductNavigationWrapper = props => (
  <div style={{ padding: 16 }} {...props} />
);
const Wordmark = () => (
  <div style={{ padding: '8px 0' }}>
    <AtlassianWordmark />
  </div>
);
const LinkItem = ({ to, ...props }: *) => (
  <Item
    component={({ className, children }) => (
      <Link to={to} className={className}>
        {children}
      </Link>
    )}
    {...props}
  />
);

const Renderer = ({ items }: any) => (
  <ProductNavigationWrapper>
    <ViewRenderer
      customComponents={{ LinkItem, ProjectSwitcher, Wordmark }}
      items={items}
    />
  </ProductNavigationWrapper>
);

class ReferenceApplication extends Component<*> {
  renderContainerNav = () => {
    const { viewController } = this.props;
    const { activeView } = viewController.state;

    return activeView && activeView.type === 'container' ? (
      <Renderer items={activeView.data} />
    ) : (
      'Container skeleton goes here.'
    );
  };
  renderProductNav = () => {
    const { uiController, viewController } = this.props;
    const { isPeeking } = uiController.state;
    const { activeView, activePeekView } = viewController.state;

    if (
      activePeekView &&
      (isPeeking || (activeView && activeView.type === 'container'))
    ) {
      return <Renderer items={activePeekView.data} />;
    }
    if (activeView && activeView.type === 'product') {
      return <Renderer items={activeView.data} />;
    }
    return 'Product skeleton goes here.';
  };
  render() {
    return (
      <LayoutManager
        globalNavigation={MyGlobalNavigation}
        productNavigation={this.renderProductNav}
        containerNavigation={this.renderContainerNav}
      >
        <RootViews />
        <ContainerViews />
        <Switch>
          <Route
            path="/projects/:projectId"
            render={({ match }) => (
              <ProjectPage projectId={match.params.projectId} />
            )}
          />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </LayoutManager>
    );
  }
}

export default () => (
  <HashRouter hashType="slash">
    <NavigationProvider initialPeekViewId="root/index">
      <ViewStateSubscriber>
        {viewController => (
          <UIStateSubscriber>
            {uiController => (
              <ReferenceApplication
                uiController={uiController}
                viewController={viewController}
              />
            )}
          </UIStateSubscriber>
        )}
      </ViewStateSubscriber>
    </NavigationProvider>
  </HashRouter>
);
