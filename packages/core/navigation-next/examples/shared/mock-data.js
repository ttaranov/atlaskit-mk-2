// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';

import { NavigationSubscriber } from '../../src';

export const globalNavPrimaryItems = [
  {
    key: 'jira',
    component: ({ className, children }: *) => (
      <NavigationSubscriber>
        {navigation => {
          function onClick() {
            if (navigation.state.productNavIsCollapsed) {
              navigation.expandProductNav();
            }
            navigation.togglePeek();
          }
          return (
            <button
              className={className}
              onClick={onClick}
              onMouseEnter={navigation.hint}
              onMouseLeave={navigation.unHint}
            >
              {children}
            </button>
          );
        }}
      </NavigationSubscriber>
    ),
    icon: JiraIcon,
    label: 'Jira',
  },
  { key: 'search', icon: SearchIcon },
  { key: 'create', icon: AddIcon },
];

export const globalNavSecondaryItems = [
  { icon: QuestionCircleIcon, label: 'Help', size: 'small' },
  {
    icon: () => (
      <Avatar
        borderColor="transparent"
        isActive={false}
        isHover={false}
        size="small"
      />
    ),
    label: 'Profile',
    size: 'small',
  },
];

/** Product root views */
const rootIndex = [
  {
    id: 'root/index:header',
    isRootLevel: true,
    items: [{ type: 'JiraWordmark', id: 'jira-wordmark' }],
    type: 'Group',
  },
  {
    id: 'root/index:menu',
    isRootLevel: true,
    items: [
      {
        type: 'LinkItem',
        id: 'dashboards',
        text: 'Dashboards',
        icon: 'DashboardIcon',
        to: '/',
      },
      {
        type: 'LinkItem',
        id: 'projects',
        text: 'Projects',
        icon: 'FolderIcon',
        to: '/projects',
      },
      {
        icon: 'IssuesIcon',
        goTo: 'root/issues',
        id: 'issues',
        text: 'Issues',
        type: 'GoToItem',
      },
    ],
    nestedGroupKey: 'menu',
    parentId: null,
    type: 'Nested',
  },
];

const rootIssues = [
  {
    id: 'root/issues:header',
    isRootLevel: true,
    items: [
      { type: 'JiraWordmark', id: 'jira-wordmark' },
      { type: 'BackItem', goTo: 'root/index', id: 'back' },
    ],
    type: 'Group',
  },
  {
    id: 'root/issues:menu',
    isRootLevel: true,
    items: [
      {
        type: 'LinkItem',
        id: 'search-issues',
        text: 'Search issues',
        to: '/issues/search',
      },
      { type: 'Separator', id: 'separator-1' },
      { type: 'Item', id: 'my-open-issues', text: 'My open issues' },
      { type: 'Item', id: 'reported-by-me', text: 'Reported by me' },
      { type: 'Item', id: 'all-issues', text: 'All issues' },
      { type: 'Item', id: 'open-issues', text: 'Open issues' },
      { type: 'Item', id: 'done-issues', text: 'Done issues' },
      { type: 'Item', id: 'viewed-recently', text: 'Viewed recently' },
      { type: 'Item', id: 'created-recently', text: 'Created recently' },
      { type: 'Item', id: 'resolved-recently', text: 'Resolved recently' },
      { type: 'Item', id: 'updated-recently', text: 'Updated recently' },
    ],
    nestedGroupKey: 'menu',
    parentId: 'root/index:menu',
    type: 'Nested',
  },
];

export const rootViews = {
  'root/index': rootIndex,
  'root/issues': rootIssues,
};

const ProjectSwitcherItem = {
  id: 'container-header',
  type: 'ProjectSwitcher',
  defaultSelected: {
    avatar: 'endeavour',
    id: 'endeavour',
    pathname: '/projects/endeavour',
    text: 'Endeavour',
    subText: 'Software project',
  },
  options: [
    {
      label: 'Recent Projects',
      options: [
        {
          avatar: 'endeavour',
          id: 'endeavour',
          pathname: '/projects/endeavour',
          text: 'Endeavour',
          subText: 'Software project',
        },
        {
          avatar: 'design-system-support',
          id: 'design-system-support',
          pathname: '/projects/design-system-support',
          text: 'Design System Support',
          subText: 'Service desk project',
        },
      ],
    },
    {
      label: 'Other Projects',
      options: [
        {
          avatar: 'design-platform',
          id: 'design-platform',
          pathname: '/projects/design-platform',
          text: 'Design Platform',
          subText: 'Software project',
        },
        {
          avatar: 'donut-world',
          id: 'donut-world',
          pathname: '/projects/donut-world',
          text: 'Donut World',
          subText: 'Software project',
        },
        {
          avatar: 'kitkat',
          id: 'kitkat',
          pathname: '/projects/kitkat',
          text: 'KitKat',
          subText: 'Software project',
        },
        {
          avatar: 'tangerine',
          id: 'tangerine',
          pathname: '/projects/tangerine',
          text: 'Tangerine',
          subText: 'Software project',
        },
      ],
    },
  ],
};

/** Product container views */
const containerProject = [
  {
    id: 'container/project/index:header',
    isRootLevel: true,
    items: [ProjectSwitcherItem],
    type: 'Group',
  },
  {
    id: 'container/project/index:menu',
    nestedGroupKey: 'menu',
    isRootLevel: true,
    items: [
      {
        icon: 'BacklogIcon',
        id: 'backlog',
        text: 'Backlog',
        to: '/projects/endeavour',
        type: 'LinkItem',
      },
      {
        icon: 'BoardIcon',
        id: 'active-sprints',
        text: 'Active sprints',
        type: 'Item',
      },
      {
        icon: 'GraphLineIcon',
        id: 'reports',
        text: 'Reports',
        type: 'Item',
      },
      {
        icon: 'ShipIcon',
        id: 'releases',
        text: 'Releases',
        type: 'Item',
      },
      {
        icon: 'IssuesIcon',
        goTo: 'container/project/issues',
        id: 'issues',
        text: 'Issues',
        type: 'GoToItem',
      },
    ],
    type: 'Nested',
  },
];

const containerProjectIssues = [
  {
    id: 'container/project/issues:header',
    isRootLevel: true,
    items: [
      ProjectSwitcherItem,
      {
        id: 'back-button',
        items: [
          { type: 'BackItem', goTo: 'container/project/index', id: 'back' },
        ],
        type: 'Group',
      },
    ],
    type: 'Group',
  },
  {
    id: 'container/project/issues:menu',
    isRootLevel: true,
    nestedGroupKey: 'menu',
    parentId: 'container/project/index:menu',
    items: [
      { type: 'Item', id: 'search-issues', text: 'Search issues' },
      { type: 'Separator', id: 'separator-1' },
      { type: 'Item', id: 'my-open-issues', text: 'My open issues' },
      { type: 'Item', id: 'reported-by-me', text: 'Reported by me' },
      { type: 'Item', id: 'all-issues', text: 'All issues' },
      { type: 'Item', id: 'open-issues', text: 'Open issues' },
      { type: 'Item', id: 'done-issues', text: 'Done issues' },
      { type: 'Item', id: 'viewed-recently', text: 'Viewed recently' },
      { type: 'Item', id: 'created-recently', text: 'Created recently' },
      { type: 'Item', id: 'resolved-recently', text: 'Resolved recently' },
      { type: 'Item', id: 'updated-recently', text: 'Updated recently' },
    ],
    type: 'Nested',
  },
];

export const containerViews = {
  'container/project/index': containerProject,
  'container/project/issues': containerProjectIssues,
};
