// @flow

import React, { Fragment } from 'react';

import ContainerProjectView from './project';

export default function ContainerViews({ projectId }: { projectId: string }) {
  return (
    <Fragment>
      <ContainerProjectView projectId={projectId} />
    </Fragment>
  );
}
