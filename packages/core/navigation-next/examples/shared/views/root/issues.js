// @flow

import React from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { LinkItem } from '../../components';

import ViewRegistrar from '../common/view-registrar';

const getItems = () => [
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

const HomeView = () => (
  <ViewRegistrar
    getItemsFactory={() => getItems}
    type="product"
    viewId="root/issues"
  />
);

export default HomeView;
