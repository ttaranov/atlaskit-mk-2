// @flow

import React, { Component, Fragment } from 'react';

import { RootViewSubscriber } from '../../../../src';

import RootHomeView from './home';
import RootSettingsView from './settings';
import RootProjectsView from './projects';

class RootViewsBase extends Component<{ rootView: * }> {
  componentDidMount() {
    const { rootView } = this.props;

    rootView.setView('root/home');
  }

  render() {
    return (
      <Fragment>
        <RootHomeView />
        <RootSettingsView />
        <RootProjectsView />
      </Fragment>
    );
  }
}
export default () => (
  <RootViewSubscriber>
    {rootView => <RootViewsBase rootView={rootView} />}
  </RootViewSubscriber>
);
