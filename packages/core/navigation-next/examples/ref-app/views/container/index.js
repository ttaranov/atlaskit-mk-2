// @flow

import React from 'react';
import ContainerProjectView from './project';

export default function ContainerViews({ projectId }: { projectId?: string }) {
  return <ContainerProjectView projectId={projectId} />;
}
