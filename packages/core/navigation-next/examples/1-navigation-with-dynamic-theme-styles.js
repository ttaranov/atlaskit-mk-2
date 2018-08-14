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
import { ThemeProvider } from 'emotion-theming';
import { colors } from '@atlaskit/theme';

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
  UIControllerSubscriber,
  modeGenerator,
} from '../src';

function makeTestItem(key) {
  return ({ children, className }: *) => (
    <div data-webdriver-test-key={key} className={className}>
      {children}
    </div>
  );
}

/**
 * Data
 */
const globalNavPrimaryItems = [
  {
    key: 'jira',
    component: ({ className, children }: *) => (
      <UIControllerSubscriber>
        {navigationUIController => {
          function onClick() {
            if (navigationUIController.state.isCollapsed) {
              navigationUIController.expand();
            }
            navigationUIController.togglePeek();
          }
          return (
            <button
              className={className}
              onClick={onClick}
              onMouseEnter={navigationUIController.peekHint}
              onMouseLeave={navigationUIController.unPeekHint}
            >
              {children}
            </button>
          );
        }}
      </UIControllerSubscriber>
    ),
    icon: JiraIcon,
    label: 'Jira',
  },
  { key: 'search', icon: SearchIcon, label: 'Search' },
  { key: 'create', icon: AddIcon, label: 'Add' },
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

const productNavSections = [
  {
    key: 'header',
    isRootLevel: true,
    items: [
      {
        type: () => (
          <div
            data-webdriver-test-key="product-header"
            css={{ padding: '12px 0' }}
          >
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
        before: DashboardIcon,
        component: makeTestItem('product-item-dashboards'),
        key: 'dashboards',
        text: 'Dashboards',
        type: Item,
      },
      {
        before: FolderIcon,
        component: makeTestItem('product-item-projects'),
        key: 'projects',
        text: 'Projects',
        type: Item,
      },
      {
        before: IssuesIcon,
        component: makeTestItem('product-item-issues'),
        key: 'issues',
        text: 'Issues',
        type: Item,
      },
    ],
  },
];

const containerNavSections = [
  {
    key: 'header',
    isRootLevel: true,
    items: [
      {
        type: ContainerHeader,
        component: makeTestItem('container-header'),
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
      {
        children: 'Group heading',
        key: 'title',
        type: GroupHeading,
      },
      {
        before: BacklogIcon,
        component: makeTestItem('container-item-backlog'),
        isSelected: true,
        key: 'backlog',
        text: 'Backlog',
        type: Item,
      },
      {
        before: BoardIcon,
        component: makeTestItem('container-item-sprints'),
        key: 'sprints',
        text: 'Active sprints',
        type: Item,
      },
      {
        before: GraphLineIcon,
        component: makeTestItem('container-item-reports'),
        key: 'reports',
        text: 'Reports',
        type: Item,
      },
      {
        key: 'separator',
        type: Separator,
      },
    ],
  },
];

// ==============================
// Render components
// ==============================

function makeTestComponent(key, element) {
  return () => <div data-webdriver-test-key={key}>{element}</div>;
}

const GlobalNavigation = makeTestComponent(
  'global-navigation',
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />,
);

const RenderSection = ({ section }: *) => (
  <div css={{ paddingTop: '16px' }}>
    {section.map(({ key, isRootLevel, items }) => (
      <Section key={key}>
        {({ css }) => (
          <div
            css={{ ...css, ...(isRootLevel ? { padding: '0 16px' } : null) }}
          >
            {items.map(({ type: Component, ...props }: any) => (
              <Component {...props} />
            ))}
          </div>
        )}
      </Section>
    ))}
  </div>
);
const ProductNavigation = makeTestComponent(
  'product-navigation',
  <RenderSection section={productNavSections} />,
);
const ContainerNavigation = makeTestComponent(
  'container-navigation',
  <RenderSection section={containerNavSections} />,
);
const Content = makeTestComponent(
  'content',
  <div style={{ padding: 30 }}>Page content</div>,
);

const customThemeMode = modeGenerator({
  text: colors.N0,
  background: colors.G500,
});

export default () => (
  <NavigationProvider>
    <ThemeProvider theme={theme => ({ ...theme, mode: customThemeMode })}>
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productNavigation={ProductNavigation}
        containerNavigation={ContainerNavigation}
      >
        <Content />
      </LayoutManager>
    </ThemeProvider>
  </NavigationProvider>
);
