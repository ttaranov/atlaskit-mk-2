// @flow

import React, { Fragment } from 'react';

import HomeView from './home';
import IssuesView from './issues';

const ProjectViews = () => (
  <Fragment>
    <HomeView />
    <IssuesView />
  </Fragment>
);

export default ProjectViews;
