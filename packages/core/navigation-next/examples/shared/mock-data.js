// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { JiraIcon, JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { Link, Route } from 'react-router-dom';

import { viewReducerUtils } from '../../src';
import type { ViewData } from '../../src/view-controller/types';

export const LinkItem = ({ components: C, to, ...props }: *) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <C.Item
          after={() => <LinkIcon size="small" />}
          component={({ children, className }) => (
            <Link className={className} to={to} onClick={props.onClick}>
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

export const GlobalLink = ({ className, to, onClick, children }: any) => {
  return (
    <Link className={className} to={to} onClick={onClick}>
      {children}
    </Link>
  );
};

export const globalNavPrimaryItems = ({ onSearchClick }: *) => [
  {
    id: 'jira',
    icon: ({ label }: { label: string }) => (
      <JiraIcon size="medium" label={label} />
    ),
    label: 'Jira',
    to: '/',
    component: GlobalLink,
  },
  { id: 'search', icon: SearchIcon, onClick: onSearchClick },
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

const getViewAnalyticsAttributes = (items: ViewData) => {
  const flattenedItems = viewReducerUtils.flattenItems(items);

  return {
    standardItemCount: flattenedItems.filter(i => i.type === 'Item').length,
    groupCount: flattenedItems.filter(i => i.type === 'Group').length,
    sectionCount: flattenedItems.filter(i => i.type === 'Section').length,
    linkCount: flattenedItems.filter(i => i.type === LinkItem).length,
  };
};

/** Product root views */
const rootIndex = [
  {
    id: 'root/index:header',
    items: [
      { type: 'Wordmark', wordmark: JiraWordmarkLogo, id: 'jira-wordmark' },
    ],
    type: 'HeaderSection',
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
      {
        icon: 'IssuesIcon',
        goTo: 'root/sortable-issues',
        id: 'sortable-issues',
        text: 'Sortable Issues',
        type: 'GoToItem',
      },
    ],
    nestedGroupKey: 'menu',
    parentId: null,
    type: 'MenuSection',
  },
];

const rootIssues = [
  {
    id: 'root/issues:header',
    items: [
      { type: 'Wordmark', wordmark: JiraWordmarkLogo, id: 'jira-wordmark' },
      {
        type: 'BackItem',
        goTo: 'root/index',
        id: 'back',
        text: 'Back to Jira',
      },
    ],
    type: 'HeaderSection',
  },
  {
    id: 'root/issues:menu',
    items: [
      {
        type: 'SectionHeading',
        id: 'section-heading',
        text: 'Issues and filters',
      },
      {
        type: LinkItem,
        id: 'search-issues',
        text: 'Search issues',
        to: '/issues/search',
      },
      {
        type: 'GroupHeading',
        id: 'heading-starred-filters',
        text: 'Starred filters',
      },
      { type: 'Item', id: 'older-than-90-days', text: 'Older than 90 days' },
      { type: 'Item', id: 'critical-bugs', text: 'Critical bugs' },
      {
        type: 'GroupHeading',
        id: 'heading-other-filters',
        text: 'Other filters',
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
    type: 'MenuSection',
    alwaysShowScrollHint: true,
  },
];

const defaultSortableGroups = [
  {
    type: 'Group',
    id: 'starred-filters-group',
    heading: 'Starred filters',
    itemIds: ['older-than-90-days', 'critical-bugs'],
  },
  {
    type: 'Group',
    id: 'other-filters-group',
    heading: 'Other filters',
    itemIds: [
      'my-open-issues',
      'reported-by-me',
      'all-issues',
      'open-issues',
      'done-issues',
      'viewed-recently',
      'created-recently',
      'resolved-recently',
      'updated-recently',
    ],
  },
];
const getRootSortableIssues = ({
  groups = defaultSortableGroups,
  onSortChange,
}: *) => () => [
  {
    id: 'root/sortable-issues:header',
    type: 'HeaderSection',
    items: [
      { type: 'Wordmark', wordmark: JiraWordmarkLogo, id: 'jira-wordmark' },
      {
        type: 'BackItem',
        goTo: 'root/index',
        id: 'back',
        text: 'Back to Jira',
      },
    ],
  },
  {
    id: 'root/sortable-issues:menu',
    nestedGroupKey: 'menu',
    parentId: 'root/index:menu',
    type: 'MenuSection',
    alwaysShowScrollHint: true,
    items: [
      {
        type: 'SectionHeading',
        id: 'section-heading',
        text: 'Sortable Issues and filters',
      },
      {
        type: LinkItem,
        id: 'search-issues',
        text: 'Search issues',
        to: '/issues/search',
      },
      {
        type: 'SortableSection',
        id: 'section-filters',
        onChange: onSortChange,
        itemsMap: {
          'older-than-90-days': {
            type: 'Item',
            text: 'Older than 90 days',
          },
          'critical-bugs': {
            type: 'Item',
            text: 'Critical bugs',
          },
          'my-open-issues': { type: 'Item', text: 'My open issues' },
          'reported-by-me': { type: 'Item', text: 'Reported by me' },
          'all-issues': { type: 'Item', text: 'All issues' },
          'open-issues': { type: 'Item', text: 'Open issues' },
          'done-issues': { type: 'Item', text: 'Done issues' },
          'viewed-recently': { type: 'Item', text: 'Viewed recently' },
          'created-recently': { type: 'Item', text: 'Created recently' },
          'resolved-recently': { type: 'Item', text: 'Resolved recently' },
          'updated-recently': { type: 'Item', text: 'Updated recently' },
        },
        groups,
      },
    ],
  },
];

export const rootViews = [
  {
    id: 'root/index',
    getItems: () => rootIndex,
    type: 'product',
    getAnalyticsAttributes: getViewAnalyticsAttributes,
  },
  {
    id: 'root/issues',
    getItems: () => rootIssues,
    type: 'product',
    getAnalyticsAttributes: getViewAnalyticsAttributes,
  },
  {
    id: 'root/sortable-issues',
    getItemsFactory: getRootSortableIssues,
    type: 'product',
    getAnalyticsAttributes: getViewAnalyticsAttributes,
    sortable: true,
  },
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
    type: 'HeaderSection',
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
    type: 'MenuSection',
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
          {
            type: 'BackItem',
            goTo: 'container/project/index',
            id: 'back',
            text: 'Back to project',
          },
        ],
        type: 'Group',
      },
    ],
    type: 'HeaderSection',
  },
  {
    id: 'container/project/issues:menu',
    nestedGroupKey: 'menu',
    parentId: 'container/project/index:menu',
    items: [
      {
        type: 'SectionHeading',
        id: 'section-heading',
        text: 'Issues and filters',
      },
      { type: 'Item', id: 'search-issues', text: 'Search issues' },
      { type: 'GroupHeading', id: 'heading', text: 'Filters' },
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
    alwaysShowScrollHint: true,
    type: 'MenuSection',
  },
];

export const containerViews = [
  {
    id: 'container/project/index',
    getItems: () => containerProject,
    type: 'container',
    getAnalyticsAttributes: getViewAnalyticsAttributes,
  },
  {
    id: 'container/project/issues',
    getItems: () => containerProjectIssues,
    type: 'container',
    getAnalyticsAttributes: getViewAnalyticsAttributes,
  },
];
