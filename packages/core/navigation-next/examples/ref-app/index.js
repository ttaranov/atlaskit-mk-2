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
  UIControllerSubscriber,
  ViewRenderer,
  withNavigationUI,
  withNavigationViewController,
} from '../../src';

import ContainerViews from './views/container';
import RootViews from './views/root';
import { ProjectSwitcher } from './pages/components';
import { DefaultGlobalNavigation } from '../shared/components';
import { HomePage, ProjectPage, ProjectsPage, SettingsPage } from './pages';

const MyGlobalNavigation = () => (
  <UIControllerSubscriber>
    {({ togglePeek }) => (
      <GlobalNavigation
        productIcon={AtlassianIcon}
        onProductClick={togglePeek}
      />
    )}
  </UIControllerSubscriber>
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
    const { navigationViewController } = this.props;
    const { activeView } = navigationViewController.state;

    return <Renderer items={activeView.data} />;
  };
  renderProductNav = () => {
    const { navigationUIController, navigationViewController } = this.props;
    const { isPeeking } = navigationUIController.state;
    const { activeView, activePeekView } = navigationViewController.state;

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
    const { navigationViewController } = this.props;
    const { activeView } = navigationViewController.state;
    return (
      <LayoutManager
        globalNavigation={DefaultGlobalNavigation}
        productNavigation={this.renderProductNav}
        containerNavigation={
          activeView &&
          activeView.type === 'container' &&
          this.renderContainerNav
        }
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

const RefApp = withNavigationUI(
  withNavigationViewController(ReferenceApplication),
);
export default () => (
  <HashRouter>
    <NavigationProvider initialPeekViewId="root/home">
      <RefApp />
    </NavigationProvider>
  </HashRouter>
);
