// @flow

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PageView } from '../components';

import ProjectProvider from '../../providers/project-provider';
import ContainerViews from '../../views/container';

export default function ProjectPage(props: { projectId: string }) {
  return (
    <PageView currentNavView="container/project">
      <ContainerViews projectId={props.projectId} />
      <ProjectProvider projectId={props.projectId}>
        {({ data }) =>
          data
            ? console.log(data) || (
                <Fragment>
                  <h1>{data.name}</h1>
                  <p>ProjectId: {props.projectId}</p>
                  <p>
                    <Link to="/">Back</Link>
                  </p>
                </Fragment>
              )
            : 'Loading project'
        }
      </ProjectProvider>
    </PageView>
  );
}
