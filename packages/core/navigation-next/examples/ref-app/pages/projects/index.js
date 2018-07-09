// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { PageView } from '../components';
import ProjectsProvider from '../../providers/projects-provider';

export default function ProjectsPage() {
  return (
    <PageView currentNavView="root/projects">
      <h1>Projects</h1>
      <ProjectsProvider>
        {({ data }) =>
          data ? (
            <ul>
              {data.map(({ name, id }) => (
                <li key={id}>
                  <Link to={`/projects/${id}`}>{name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading projects...</p>
          )
        }
      </ProjectsProvider>
      <p>
        <Link to="/">Back</Link>
      </p>
    </PageView>
  );
}
