// @flow

import React, { Component } from 'react';
import { RootViewSubscriber } from '../../../../../src';
import ProjectsProvider from '../../../providers/projects-provider';

const getItems = projects => [
  {
    type: 'Group',
    id: 'header',
    items: [
      {
        type: 'Wordmark',
        id: 'wordmark',
      },
    ],
  },
  {
    type: 'Group',
    id: 'menu',
    items: [
      { id: 'back', type: 'LinkItem', text: 'Back to home', to: '/' },
      { id: 'projects-title', type: 'Title', text: 'Projects' },
      ...projects.map(({ name }) => ({ type: 'Item', text: name, id: name })),
    ],
  },
];

class RootProjectsView extends Component<{ rootView: *, projects: * }> {
  componentDidMount() {
    const { projects, rootView } = this.props;
    rootView.addView('root/projects', () => getItems(projects));
  }

  render() {
    return null;
  }
}

export default () => (
  <ProjectsProvider>
    {({ data: projects }) =>
      projects ? (
        <RootViewSubscriber>
          {rootView => (
            <RootProjectsView rootView={rootView} projects={projects} />
          )}
        </RootViewSubscriber>
      ) : null
    }
  </ProjectsProvider>
);
