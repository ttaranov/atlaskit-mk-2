// @flow

import React, { Fragment } from 'react';

import RootHomeView from './home';
import RootSettingsView from './settings';
import RootProjectsView from './projects';

export default function RootViewsBase() {
  return (
    <Fragment>
      <RootHomeView />
      <RootSettingsView />
      <RootProjectsView />
    </Fragment>
  );
}
