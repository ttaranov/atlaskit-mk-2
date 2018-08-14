// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { Link, Route } from 'react-router-dom';

import { PeekToggleItem } from '../../src';

export const LinkItem = ({ components: C, to, ...props }: *) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <C.Item
          after={() => <LinkIcon size="small" />}
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};

const gridSize = gridSizeFn();

const JiraWordmark = () => (
  <div css={{ padding: `${gridSize * 2}px 0` }}>
    <JiraWordmarkLogo />
  </div>
);

export const globalNavPrimaryItems = [
  { id: 'jira', icon: JiraIcon, label: 'Jira' },
  { id: 'peek-toggle', component: PeekToggleItem, icon: null },
  { id: 'search', icon: SearchIcon },
  { id: 'create', icon: AddIcon },
];

export const globalNavSecondaryItems = [
  { id: 'help', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
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
    id: 'profile',
  },
];

/** Product root views */
const rootIndex = [
  {
    id: 'root/index:header',
    items: [{ type: JiraWordmark, id: 'jira-wordmark' }],
    type: 'Section',
  },
  {
    id: 'root/index:menu',
    items: [
      {
        type: LinkItem,
        id: 'dashboards',
        text: 'Dashboards',
        icon: 'DashboardIcon',
        to: '/',
      },
      {
        type: LinkItem,
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
    type: 'Section',
  },
];

const rootIssues = [
  {
    id: 'root/issues:header',
    items: [
      { type: JiraWordmark, id: 'jira-wordmark' },
      { type: 'BackItem', goTo: 'root/index', id: 'back' },
    ],
    type: 'Section',
  },
  {
    id: 'root/issues:menu',
    items: [
      {
        type: 'Group',
        hasSeparator: true,
        id: 'search-issues-group',
        items: [
          {
            type: LinkItem,
            id: 'search-issues',
            text: 'Search issues',
            to: '/issues/search',
          },
        ],
      },
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
    type: 'Section',
  },
];

export const rootViews = [
  { id: 'root/index', getItems: () => rootIndex, type: 'product' },
  { id: 'root/issues', getItems: () => rootIssues, type: 'product' },
];

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
    items: [ProjectSwitcherItem],
    type: 'Section',
  },
  {
    id: 'container/project/index:menu',
    nestedGroupKey: 'menu',
    items: [
      {
        icon: 'BacklogIcon',
        id: 'backlog',
        text: 'Backlog',
        to: '/projects/endeavour',
        type: LinkItem,
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
    type: 'Section',
  },
];

const containerProjectIssues = [
  {
    id: 'container/project/issues:header',
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
    type: 'Section',
  },
  {
    id: 'container/project/issues:menu',
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
    type: 'Section',
  },
];

export const containerViews = [
  {
    id: 'container/project/index',
    getItems: () => containerProject,
    type: 'container',
  },
  {
    id: 'container/project/issues',
    getItems: () => containerProjectIssues,
    type: 'container',
  },
];
