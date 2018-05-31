// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  containerViewState,
  rootViewState,
  NavigationSubscriber,
} from '../../src';

import { containerViews, rootViews } from './mock-data';

const maybeRegisterViews = (viewState: *, views: { [string]: any[] }) => () => {
  const viewKeys = Object.keys(views);
  viewKeys.forEach(key => {
    if (viewState.views[key]) {
      return;
    }
    const view = views[key];
    viewState.addView(key, () => view);
  });
};
const maybeRegisterContainerViews = maybeRegisterViews(
  containerViewState,
  containerViews,
);
const maybeRegisterRootViews = maybeRegisterViews(rootViewState, rootViews);

const ROOT_INDEX_VIEW = 'root/index';

/**
 * Root-level routes
 */
export class DashboardsView extends Component<{}> {
  viewKey = 'root/index';

  componentDidMount() {
    maybeRegisterRootViews();
    rootViewState.setView(this.viewKey);
    containerViewState.setView(null);
  }

  render() {
    return (
      <Fragment>
        <h1>Dashboards</h1>
        <p>Hello here are your dashboards.</p>
      </Fragment>
    );
  }
}

class ProjectsViewBase extends Component<*> {
  viewKey = 'root/index';

  componentDidMount() {
    maybeRegisterRootViews();
    rootViewState.setView(this.viewKey);
    containerViewState.setView(null);
    this.props.navUI.unPeek();
  }

  render() {
    return (
      <Fragment>
        <h1>Projects</h1>
        <p>Hello here are your projects.</p>
        <h3>
          <Link to="/projects/endeavour">Endeavour</Link>
        </h3>
      </Fragment>
    );
  }
}
export const ProjectsView = () => (
  <NavigationSubscriber>
    {navUI => <ProjectsViewBase navUI={navUI} />}
  </NavigationSubscriber>
);

export class SearchIssuesView extends Component<{}> {
  viewKey = 'root/issues';

  componentDidMount() {
    maybeRegisterRootViews();
    rootViewState.setView(this.viewKey);
    containerViewState.setView(null);
  }

  render() {
    return (
      <Fragment>
        <h1>Search issues</h1>
        <p>Hello search for your issues here.</p>
      </Fragment>
    );
  }
}

/**
 * Container views
 */
export class BacklogView extends Component<{}> {
  viewKey = 'container/project/index';

  componentDidMount() {
    maybeRegisterRootViews();
    maybeRegisterContainerViews();
    containerViewState.setView(this.viewKey);
    rootViewState.setView(ROOT_INDEX_VIEW);
  }

  render() {
    return (
      <Fragment>
        <h1>Backlog</h1>
        <p>Hello this is the backlog.</p>
        <p>
          <Link to="/">Go back home</Link>
        </p>
      </Fragment>
    );
  }
}
