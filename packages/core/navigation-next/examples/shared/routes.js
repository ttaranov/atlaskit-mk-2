// @flow
/* eslint-disable react/no-multi-comp */

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  UIControllerSubscriber,
  withNavigationViewController,
  withNavigationUI,
} from '../../src';

import { containerViews, rootViews } from './mock-data';
import ShortcutsPlugin from './shortcuts-plugin';

class SetActiveViewBase extends Component<{
  id: string,
  navigationUIController: *,
  navigationViewController: *,
}> {
  componentDidMount() {
    const { id, navigationUIController, navigationViewController } = this.props;
    const { containerViewId, productViewId } = navigationViewController.state;
    if (id !== containerViewId && id !== productViewId) {
      navigationViewController.setView(id);
    }
    navigationUIController.unPeek();
  }
  render() {
    return null;
  }
}
const SetActiveView = withNavigationUI(
  withNavigationViewController(SetActiveViewBase),
);

class ViewRegistrarBase extends Component<{
  navigationViewController: *,
  view: *,
}> {
  componentDidMount() {
    const { navigationViewController, view } = this.props;
    if (!navigationViewController.views[view.id]) {
      navigationViewController.addView(view);
    }
  }

  render() {
    return null;
  }
}

class SortableViewRegistrarBase extends Component<*, *> {
  state = {
    groups: undefined,
  };

  componentDidMount() {
    this.registerView();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.groups !== this.state.groups ||
      prevProps.criticalBugsCount !== this.props.criticalBugsCount
    ) {
      this.registerView();
    }
  }

  // What do we do if the view changes over time?
  // 1 - Change item properties is fine as they aren't managed by state
  // 2 - Change group properties: such as itemIds is fine as we control the group state
  // getDerivedStateFromProps(props, state) {}

  registerView = () => {
    const { navigationViewController, view } = this.props;
    const { groups } = this.state;
    const { onSortChange } = this;
    const { getItemsFactory, ...rest } = view;

    const getItemsWithSortChange = getItemsFactory({
      groups,
      onSortChange,
    });

    navigationViewController.addView({
      getItems: getItemsWithSortChange,
      ...rest,
    });
  };

  onSortChange = (groups: *) => {
    this.setState({ groups });
  };

  render() {
    return null;
  }
}

const ViewRegistrar = withNavigationViewController(ViewRegistrarBase);
const SortableViewRegistrar = withNavigationViewController(
  SortableViewRegistrarBase,
);

const RootViews = () => (
  <Fragment>
    {rootViews.map(
      view =>
        view.sortable ? (
          <SortableViewRegistrar key={view.id} view={view} />
        ) : (
          <ViewRegistrar key={view.id} view={view} />
        ),
    )}
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
    this.props.navigationUIController.unPeek();
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
  <UIControllerSubscriber>
    {navigationUIController => (
      <BacklogViewBase navigationUIController={navigationUIController} />
    )}
  </UIControllerSubscriber>
);
