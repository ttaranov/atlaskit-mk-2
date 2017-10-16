/* @flow */

import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import { Route, matchPath } from 'react-router-dom';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import {
  AkContainerNavigationNested as NestedNav,
} from '@atlaskit/navigation';

import DefaultNav from './navigations/Default';
import PackagesNav from './navigations/Packages';
import DocsNav from './navigations/Docs';
import PatternsNav from './navigations/Patterns';

import { RouterNavigationItem } from './utils/linkComponents';
import type { Directory } from '../../types';

export type GroupsProps = {
  docs: Directory,
  patterns: Directory,
  packages: Directory,
}

export type GroupsState = {
  parentRoute: ?Object,
  stack: Array<Node>
}

export type GroupsContext = {
  router: Object
}

export default class Groups extends React.Component<GroupsProps, GroupsState> {
  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    parentRoute: null,
    stack: [[]],
  }

  componentWillMount() {
    this.resolveRoutes(this.context.router.route.location.pathname);
  }

  componentWillReceiveProps(nextProps: GroupsProps, nextContext: GroupsContext) {
    this.resolveRoutes(nextContext.router.route.location.pathname);
  }

  resolveRoutes(pathname: string) {
    const menus = [
      <Route path="/">
        <DefaultNav pathname={pathname} />
      </Route>,
      <Route path="/docs">
        <DocsNav pathname={pathname} docs={this.props.docs} />
      </Route>,
      <Route path="/packages">
        <PackagesNav pathname={pathname} packages={this.props.packages} />
      </Route>,
      <Route path="/patterns">
        <PatternsNav pathname={pathname} patterns={this.props.patterns} />
      </Route>,
    ];

    const stack = menus
      .filter(menu => matchPath(pathname, menu.props))
      .map(menu => [
        React.cloneElement(menu, { key: menu.props.path }),
      ]);

    // $FlowFixMe
    const parentRoute = stack.length > 1 ? stack[stack.length - 2][0].props.path : null;

    this.setState({ parentRoute, stack });
  }

  render() {
    return (
      <div>
        {this.state.parentRoute ? (
          <div style={{ marginBottom: '10px' }}>
            <RouterNavigationItem
              href={this.state.parentRoute}
              icon={<ArrowLeftIcon label="Back" />}
              text="Back"
            />
          </div>
        ) : null}
        <NestedNav stack={this.state.stack} />
      </div>
    );
  }
}
