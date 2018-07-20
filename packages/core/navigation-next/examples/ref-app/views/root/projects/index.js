// @flow

import React, { Component } from 'react';
import { ViewStateSubscriber } from '../../../../../src';
import ProjectsProvider from '../../../providers/projects-provider';

const getItems = projects => () => [
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
      { id: 'projects-title', type: 'GroupHeading', text: 'Projects' },
      ...projects.map(({ name }) => ({ type: 'Item', text: name, id: name })),
    ],
  },
];

class RootProjectsView extends Component<{ navigationViews: *, projects: * }> {
  componentDidMount() {
    const { projects, navigationViews } = this.props;
    navigationViews.addView({
      id: 'root/projects',
      type: 'product',
      getItems: getItems(projects),
    });
  }

  render() {
    return null;
  }
}

export default () => (
  <ProjectsProvider>
    {({ data: projects }) =>
      projects ? (
        <ViewStateSubscriber>
          {navigationViews => (
            <RootProjectsView
              navigationViews={navigationViews}
              projects={projects}
            />
          )}
        </ViewStateSubscriber>
      ) : null
    }
  </ProjectsProvider>
);
