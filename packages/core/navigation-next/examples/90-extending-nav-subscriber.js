// @flow

import React, { type ComponentType } from 'react';
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
  UIControllerSubscriber,
} from '../src';

// ==============================
// Data
// ==============================

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

// ==============================
// Render components
// ==============================

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
            {items.map(({ type: Component, ...props }: any) => (
              <Component {...props} />
            ))}
          </div>
        )}
      </Section>
    ))}
  </div>
);
const ProductNavigation = () => (
  <RenderSection section={productRootNavSections} />
);
const ContainerNavigation = () => (
  <RenderSection section={productContainerNavSections} />
);

// ==============================
// Collapse Status Listener
// ==============================

function NOOP() {}

type StatusEvents = {
  onResizeEnd: number => void,
  onResizeStart: number => void,
  onPeekHint: () => void,
  onUnpeekHint: () => void,
  onPeek: () => void,
  onUnpeek: () => void,
};
type NavState = {
  isCollapsed: boolean,
  isPeekHinting: boolean,
  isPeeking: boolean,
  isResizing: boolean,
  productNavWidth: number,
};
type StatusProps = StatusEvents & {
  navState: NavState,
};

const withNavState = (Comp: ComponentType<*>) => (props: StatusEvents) => (
  <UIControllerSubscriber>
    {nav => <Comp navState={nav.state} {...props} />}
  </UIControllerSubscriber>
);

class CollapseStatus extends React.Component<StatusProps> {
  static defaultProps = {
    onResizeEnd: NOOP,
    onResizeStart: NOOP,
  };
  componentDidUpdate(prevProps: StatusProps) {
    const {
      onResizeStart,
      onResizeEnd,
      onPeekHint,
      onUnpeekHint,
      onPeek,
      onUnpeek,
    } = this.props;
    const {
      isPeekHinting,
      isPeeking,
      isResizing,
      productNavWidth,
    } = this.props.navState;

    // manual resize
    if (isResizing && !prevProps.navState.isResizing) {
      onResizeStart(productNavWidth);
    }
    if (!isResizing && prevProps.navState.isResizing) {
      onResizeEnd(productNavWidth);
    }

    // hinting
    if (isPeekHinting && !prevProps.navState.isPeekHinting) {
      onPeekHint();
    }
    if (!isPeekHinting && prevProps.navState.isPeekHinting) {
      onUnpeekHint();
    }

    // peeking
    if (isPeeking && !prevProps.navState.isPeeking) {
      onPeek();
    }
    if (!isPeeking && prevProps.navState.isPeeking) {
      onUnpeek();
    }
  }
  render() {
    return null;
  }
}
const CollapseStatusListener = withNavState(CollapseStatus);

// ==============================
// Nav Implementation
// ==============================

type StatusEvent = { name: string, value?: number };
type State = { callStack: Array<StatusEvent> };

// eslint-disable-next-line react/no-multi-comp
export default class ExtendingNavSubscriber extends React.Component<*, State> {
  state = { callStack: [] };
  onEmit = (name: string) => (value?: number) => {
    const callStack = this.state.callStack.slice(0);
    callStack.push({ name, value });
    this.setState({ callStack });
  };
  getStack = () => {
    const { callStack } = this.state;
    const total = 10;
    const len = callStack.length;
    return len < total ? callStack : callStack.slice(len - total, len);
  };
  render() {
    const lastTen = this.getStack();

    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={GlobalNavigation}
          productNavigation={ProductNavigation}
          containerNavigation={ContainerNavigation}
          onCollapseStart={this.onEmit('onCollapseStart')}
          onCollapseEnd={this.onEmit('onCollapseEnd')}
          onExpandStart={this.onEmit('onExpandStart')}
          onExpandEnd={this.onEmit('onExpandEnd')}
        >
          <CollapseStatusListener
            onResizeEnd={this.onEmit('onResizeEnd')}
            onResizeStart={this.onEmit('onResizeStart')}
            onPeek={this.onEmit('onPeek')}
            onUnpeek={this.onEmit('onUnpeek')}
            onPeekHint={this.onEmit('onPeekHint')}
            onUnpeekHint={this.onEmit('onUnpeekHint')}
          />
          <div style={{ padding: 30 }}>
            <h4>
              Extending <code>NavigationSubscriber</code>
            </h4>
            <button onClick={() => this.setState({ callStack: [] })}>
              Clear
            </button>
            {lastTen.length ? (
              lastTen.map(e => (
                <p key={e.name}>
                  <code>
                    {e.name}({e.value})
                  </code>
                </p>
              ))
            ) : (
              <p>Interact with navigation to see the events logged here...</p>
            )}
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
