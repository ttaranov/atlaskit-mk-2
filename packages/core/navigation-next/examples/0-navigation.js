// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import AddIcon from '@atlaskit/icon/glyph/add';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { JiraWordmark } from '@atlaskit/logo';

import {
  ContainerHeader,
  GlobalNav,
  GroupHeading,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
  UIStateSubscriber,
} from '../src';

/**
 * Data
 */
const globalNavPrimaryItems = [
  {
    key: 'jira',
    component: ({ className, children }: *) => (
      <UIStateSubscriber>
        {navigation => {
          function onClick() {
            if (navigation.state.isCollapsed) {
              navigation.expand();
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
      </UIStateSubscriber>
    ),
    icon: JiraIcon,
    label: 'Jira',
  },
  { key: 'search', icon: SearchIcon },
  { key: 'create', icon: AddIcon },
];

const globalNavSecondaryItems = [
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

const productRootNavSections = [
  {
    key: 'header',
    isRootLevel: true,
    items: [
      {
        type: () => (
          <div css={{ padding: '12px 0' }}>
            <JiraWordmark />
          </div>
        ),
        key: 'jira-wordmark',
      },
    ],
  },
  {
    key: 'menu',
    isRootLevel: true,
    items: [
      {
        type: Item,
        key: 'dashboards',
        text: 'Dashboards',
        before: DashboardIcon,
      },
      { type: Item, key: 'projects', text: 'Projects', before: FolderIcon },
      { type: Item, key: 'issues', text: 'Issues', before: IssuesIcon },
    ],
  },
];

const productContainerNavSections = [
  {
    key: 'header',
    isRootLevel: true,
    items: [
      {
        type: ContainerHeader,
        key: 'project-switcher',
        before: itemState => (
          <ItemAvatar itemState={itemState} appearance="square" />
        ),
        text: 'My software project',
        subText: 'Software project',
      },
    ],
  },
  {
    key: 'menu',
    isRootLevel: true,
    items: [
      { type: GroupHeading, key: 'title', children: 'Group heading' },
      { type: Item, key: 'backlog', text: 'Backlog', before: BacklogIcon },
      { type: Item, key: 'sprints', text: 'Active sprints', before: BoardIcon },
      { type: Item, key: 'reports', text: 'Reports', before: GraphLineIcon },
      { type: Separator, key: 'separator' },
    ],
  },
];

/**
 * Render components
 */
const GlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

const RenderSection = ({ section }: *) => (
  <div css={{ paddingTop: '16px' }}>
    {section.map(({ key, isRootLevel, items }) => (
      <Section key={key}>
        {({ css }) => (
          <div
            css={{ ...css, ...(isRootLevel ? { padding: '0 16px' } : null) }}
          >
            {items.map(({ type: Component, ...props }) => (
              <Component {...props} />
            ))}
          </div>
        )}
      </Section>
    ))}
  </div>
);
const ProductRoot = () => <RenderSection section={productRootNavSections} />;
const ProductContainer = () => (
  <RenderSection section={productContainerNavSections} />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={GlobalNavigation}
      productRootNavigation={ProductRoot}
      productContainerNavigation={ProductContainer}
    >
      <div style={{ padding: 30 }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
