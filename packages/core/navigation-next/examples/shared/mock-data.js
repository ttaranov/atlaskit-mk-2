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
        type: 'Item',
        id: 'dashboards',
        text: 'Dashboards',
        icon: 'DashboardIcon',
      },
      {
        type: 'Item',
        id: 'projects',
        text: 'Projects',
        icon: 'FolderIcon',
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
    id: 'root-issues-header',
    isRootLevel: true,
    items: [
      { type: 'JiraWordmark', id: 'jira-wordmark' },
      { type: 'BackItem', goTo: 'root/index', id: 'back' },
    ],
    type: 'Group',
  },
  {
    id: 'root-issues-menu',
    isRootLevel: true,
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
    nestedGroupKey: 'menu',
    parentId: 'root/index:menu',
    type: 'Nested',
  },
];

export const rootViews = {
  'root/index': rootIndex,
  'root/issues': rootIssues,
};

/** Product container views */
const containerIssues = {
  id: 'container-issues',
  parentId: null,
  view: [
    {
      key: 'menu',
      id: 'container-issues-menu',
      items: [
        {
          icon: 'BacklogIcon',
          key: 'backlog',
          text: 'Backlog',
          type: 'Item',
        },
        {
          icon: 'BoardIcon',
          key: 'active-sprints',
          text: 'Active sprints',
          type: 'Item',
        },
        {
          icon: 'GraphLineIcon',
          key: 'reports',
          text: 'Reports',
          type: 'Item',
        },
        {
          icon: 'ShipIcon',
          key: 'releases',
          text: 'Releases',
          type: 'Item',
        },
        {
          icon: 'IssuesIcon',
          goTo: 'container-issues-issues',
          key: 'issues',
          text: 'Issues',
          type: 'GoToItem',
        },
      ],
      type: 'Group',
    },
  ],
};

const containerIssuesIssues = {
  id: 'container-issues-issues',
  parentId: 'container-issues',
  view: [
    {
      key: 'menu',
      id: 'container-issues-issues-menu',
      parentId: 'container-issues-menu',
      items: [
        { type: 'Item', key: 'search-issues', text: 'Search issues' },
        { type: 'Separator', key: 'separator-1' },
        { type: 'Item', key: 'my-open-issues', text: 'My open issues' },
        { type: 'Item', key: 'reported-by-me', text: 'Reported by me' },
        { type: 'Item', key: 'all-issues', text: 'All issues' },
        { type: 'Item', key: 'open-issues', text: 'Open issues' },
        { type: 'Item', key: 'done-issues', text: 'Done issues' },
        { type: 'Item', key: 'viewed-recently', text: 'Viewed recently' },
        { type: 'Item', key: 'created-recently', text: 'Created recently' },
        { type: 'Item', key: 'resolved-recently', text: 'Resolved recently' },
        { type: 'Item', key: 'updated-recently', text: 'Updated recently' },
      ],
      type: 'Group',
    },
  ],
};
export const containerViews = [containerIssues, containerIssuesIssues];
