// @flow

import React, { Component } from 'react';
import { ContainerViewSubscriber } from '../../../../../src';
import ProjectsProvider from '../../../providers/projects-provider';
import ProjectProvider from '../../../providers/project-provider';

const getItems = (project, projects) => [
  {
    type: 'Group',
    id: 'header',
    items: [
      ...(projects
        ? [
            {
              id: 'project-switcher',
              type: 'ProjectSwitcher',
              items: projects,
              initialValue: project ? project.id : '',
            },
          ]
        : []),
    ],
  },
  {
    type: 'Group',
    id: 'menu',
    items: [
      {
        id: 'back',
        type: 'LinkItem',
        text: 'Back to projects',
        to: '/projects',
      },
      { id: 'boards', type: 'Item', text: 'Boards' },
      { id: 'pages', type: 'Item', text: 'Pages' },
      { id: 'settings', type: 'Item', text: 'Settings' },
      ...(project && project.shortcuts
        ? [
            { id: 'shortcuts-title', type: 'Title', text: 'Shortcuts' },
            ...project.shortcuts.map(s => ({
              id: s.name,
              type: 'Item',
              text: s.name,
            })),
          ]
        : []),
    ],
  },
];

class ContainerProjectView extends Component<{
  containerView: *,
  project: *,
  projects: *,
}> {
  componentDidMount() {
    this.setView();
  }
  componentDidUpdate(prevProps) {
    const { project, projects } = this.props;
    if (prevProps.project !== project || prevProps.projects !== projects) {
      this.setView();
    }
  }

  setView = () => {
    const { project, projects, containerView } = this.props;
    containerView.addView('container/project', () =>
      getItems(project, projects),
    );
  };

  render() {
    return null;
  }
}

export default ({ projectId }: *) => (
  <ProjectsProvider>
    {({ data: projects }) => (
      <ProjectProvider projectId={projectId}>
        {({ data: project }) => (
          <ContainerViewSubscriber>
            {containerView => (
              <ContainerProjectView
                containerView={containerView}
                project={project}
                projects={projects}
              />
            )}
          </ContainerViewSubscriber>
        )}
      </ProjectProvider>
    )}
  </ProjectsProvider>
);
