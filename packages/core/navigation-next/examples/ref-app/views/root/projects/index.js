// @flow

import React, { Component } from 'react';
import { ViewControllerSubscriber } from '../../../../../src';
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

class RootProjectsView extends Component<{
  navigationViewController: *,
  projects: *,
}> {
  componentDidMount() {
    const { projects, navigationViewController } = this.props;
    navigationViewController.addView({
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
        <ViewControllerSubscriber>
          {navigationViewController => (
            <RootProjectsView
              navigationViewController={navigationViewController}
              projects={projects}
            />
          )}
        </ViewControllerSubscriber>
      ) : null
    }
  </ProjectsProvider>
);
