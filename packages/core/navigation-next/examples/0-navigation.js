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
  ContainerSwitcher,
  GlobalNav,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
  Section,
  SectionSeparator,
  SectionTitle,
} from '../src';

/**
 * Data
 */
const globalNavPrimaryItems = [
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

const avatarSrc = name =>
  `https://api.adorable.io/avatars/64/${name}@adorable.png`;

const recentProjects = [
  {
    key: 'superfun',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('superfun')}
      />
    ),
    text: 'Superfun',
    subText: 'Software project',
  },
  {
    key: 'strawberry-service',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('strawberry-service')}
      />
    ),
    text: 'Strawberry Service',
    subText: 'Service desk project',
  },
];
const otherProjects = [
  {
    key: 'vanilla-business',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('vanilla-business')}
      />
    ),
    text: 'Vanilla business',
    subText: 'Business project',
  },
  {
    key: 'nucleus',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('nucleus')}
      />
    ),
    text: 'Nucleus',
    subText: 'Sofware project',
  },
  {
    key: 'atom',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('atom')}
      />
    ),
    text: 'Atom',
    subText: 'Sofware project',
  },
  {
    key: 'cell',
    before: st8 => (
      <ItemAvatar
        borderColor="transparent"
        itemState={st8}
        appearance="square"
        src={avatarSrc('cell')}
      />
    ),
    text: 'Cell',
    subText: 'Business project',
  },
];
const projectGroups = [
  {
    label: 'Recent Projects',
    options: recentProjects,
  },
  {
    label: 'Other Projects',
    options: otherProjects,
  },
];
const productContainerNavSections = [
  {
    key: 'header',
    items: [
      {
        type: ContainerSwitcher,
        key: 'superfun',
        before: st8 => (
          <ItemAvatar
            borderColor="transparent"
            itemState={st8}
            appearance="square"
            src={avatarSrc('superfun')}
          />
        ),
        text: 'Superfun',
        subText: 'Software project',
        items: projectGroups,
      },
    ],
  },
  {
    key: 'menu',
    items: [
      { type: SectionTitle, key: 'title', children: 'Section title' },
      { type: Item, key: 'backlog', text: 'Backlog', before: BacklogIcon },
      { type: Item, key: 'sprints', text: 'Active sprints', before: BoardIcon },
      { type: Item, key: 'reports', text: 'Reports', before: GraphLineIcon },
      { type: SectionSeparator, key: 'separator' },
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
    {section.map(({ key, items }) => (
      <Section key={key}>
        {({ css }) => (
          <div css={css}>
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
