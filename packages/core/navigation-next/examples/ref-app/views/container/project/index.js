// @flow

import React, { Component } from 'react';
import { withNavigationViews } from '../../../../../src';
import ProjectsProvider from '../../../providers/projects-provider';
import ProjectProvider from '../../../providers/project-provider';

const getItems = (project, projects) => () => [
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
            { id: 'shortcuts-title', type: 'GroupHeading', text: 'Shortcuts' },
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
  navigationViews: *,
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
    const { project, projects, navigationViews } = this.props;
    navigationViews.addView({
      id: 'container/project',
      type: 'container',
      getItems: getItems(project, projects),
    });
  };

  render() {
    return null;
  }
}
const ContainerView = withNavigationViews(ContainerProjectView);

export default ({ projectId }: *) => (
  <ProjectsProvider>
    {({ data: projects }) => (
      <ProjectProvider projectId={projectId}>
        {({ data: project }) => (
          <ContainerView project={project} projects={projects} />
        )}
      </ProjectProvider>
    )}
  </ProjectsProvider>
);
