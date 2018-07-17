// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  UIStateSubscriber,
  withNavigationViews,
  withNavigationUI,
} from '../../src';

import { containerViews, rootViews } from './mock-data';
import ShortcutsPlugin from './shortcuts-plugin';

class SetActiveViewBase extends Component<{
  id: string,
  navigationUI: *,
  navigationViews: *,
}> {
  componentDidMount() {
    const { id, navigationUI, navigationViews } = this.props;
    const { containerViewId, productViewId } = navigationViews.state;
    if (id !== containerViewId && id !== productViewId) {
      navigationViews.setView(id);
    }
    navigationUI.unPeek();
  }
  render() {
    return null;
  }
}
const SetActiveView = withNavigationUI(withNavigationViews(SetActiveViewBase));

class ViewRegistrarBase extends Component<{ navigationViews: *, view: * }> {
  componentDidMount() {
    const { navigationViews, view } = this.props;
    if (!navigationViews.views[view.id]) {
      navigationViews.addView(view);
    }
  }
  render() {
    return null;
  }
}
const ViewRegistrar = withNavigationViews(ViewRegistrarBase);

const RootViews = () => (
  <Fragment>
    {rootViews.map(view => <ViewRegistrar key={view.id} view={view} />)}
  </Fragment>
);
const ContainerViews = () => (
  <Fragment>
    {containerViews.map(view => <ViewRegistrar key={view.id} view={view} />)}
  </Fragment>
);
const CoreViews = () => <RootViews />;

/**
 * Root-level routes
 */
export const DashboardsView = () => (
  <Fragment>
    <CoreViews />
    <SetActiveView id="root/index" />
    <h1>Dashboards</h1>
    <p>Hello here are your dashboards.</p>
  </Fragment>
);

export const ProjectsView = () => (
  <Fragment>
    <CoreViews />
    <SetActiveView id="root/index" />
    <h1>Projects</h1>
    <p>Hello here are your projects.</p>
    <h3>
      <Link to="/projects/endeavour">Endeavour</Link>
    </h3>
  </Fragment>
);

export const SearchIssuesView = () => (
  <Fragment>
    <CoreViews />
    <SetActiveView id="root/issues" />
    <h1>Search issues</h1>
    <p>Hello search for your issues here.</p>
  </Fragment>
);

/**
 * Container-level routes
 */
class BacklogViewBase extends Component<*> {
  componentDidMount() {
    this.props.navUI.unPeek();
  }

  render() {
    return (
      <Fragment>
        <CoreViews />
        <ContainerViews />
        <SetActiveView id="container/project/index" />
        <h1>Backlog</h1>
        <p>Hello this is the backlog.</p>
        <p>
          <Link to="/">Go back home</Link>
        </p>
        <ShortcutsPlugin />
      </Fragment>
    );
  }
}
export const BacklogView = () => (
  <UIStateSubscriber>
    {navUI => <BacklogViewBase navUI={navUI} />}
  </UIStateSubscriber>
);
