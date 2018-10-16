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
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { JiraIcon, JiraWordmark } from '@atlaskit/logo';

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
    icon: ({ label }: { label: string }) => (
      <JiraIcon size="medium" label={label} />
    ),
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

const withNavState = (Comp: ComponentType<*>) => (props: *) => (
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

const Logger = p => (
  <div
    {...p}
    css={{
      background: 'Wheat',
      borderRadius: 2,
      fontSize: 12,
      padding: 10,
      marginTop: 16,
      position: 'relative',
      width: 180,
    }}
  />
);

type BoxProps = { pending: boolean, width: number | 'auto' };
const ResizeBox = ({ pending, width }: BoxProps) => (
  <div
    css={{
      alignItems: 'center',
      background: 'PaleVioletRed',
      borderRadius: 2,
      boxSizing: 'border-box',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontSize: 18,
      height: 200,
      justifyContent: 'center',
      padding: 10,
      transition: 'width 220ms cubic-bezier(0.2, 0, 0, 1)',
      width,
    }}
  >
    <div>
      My width is <code>{width}px</code>
    </div>
    <div style={{ fontSize: 12 }}>{pending ? '(resize pending)' : '・'}</div>
  </div>
);

type StatusEvent = { key: string, name: string, value?: number };
type State = {
  boxWidth: number | 'auto',
  callStack: Array<StatusEvent>,
  resizePending: boolean,
};
function makeKey() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

// eslint-disable-next-line react/no-multi-comp
class ExtendingNavSubscriber extends React.Component<*, State> {
  state = { callStack: [], boxWidth: 'auto', resizePending: false };
  componentDidMount() {
    this.updateWidth();
  }
  onEmit = (name: string) => (value?: number) => {
    const callStack = this.state.callStack.slice(0);
    const key = makeKey();
    callStack.push({ key, name, value });
    this.setState({ callStack });
  };
  getStack = () => {
    const { callStack } = this.state;
    const total = 10;
    const len = callStack.length;
    return len < total ? callStack : callStack.slice(len - total, len);
  };
  onCollapseStart = () => {
    this.onEmit('onCollapseStart')();
    this.makePending();
  };
  onCollapseEnd = () => {
    this.onEmit('onCollapseEnd')();
    this.updateWidth();
  };
  onExpandStart = () => {
    if (this.props.navState.isResizing) return; // ignore expand events when resizing
    this.onEmit('onExpandStart')();
    this.makePending();
  };
  onExpandEnd = () => {
    if (this.props.navState.isResizing) return; // ignore expand events when resizing
    this.onEmit('onExpandEnd')();
    this.updateWidth();
  };
  onResizeEnd = () => {
    this.onEmit('onResizeEnd')();
    this.updateWidth();
  };
  onResizeStart = () => {
    this.onEmit('onResizeStart')();
    this.makePending();
  };
  updateWidth = () => {
    const { isCollapsed, productNavWidth } = this.props.navState;
    const less = (isCollapsed ? 0 : productNavWidth) + 64;
    const boxWidth = window.innerWidth - less - 32;
    this.setState({ boxWidth, resizePending: false });
  };
  makePending = () => {
    this.setState({ resizePending: true });
  };
  render() {
    const { boxWidth, resizePending } = this.state;
    const lastTen = this.getStack();

    return (
      <LayoutManager
        globalNavigation={GlobalNavigation}
        productNavigation={ProductNavigation}
        containerNavigation={ContainerNavigation}
        onCollapseStart={this.onCollapseStart}
        onCollapseEnd={this.onCollapseEnd}
        onExpandStart={this.onExpandStart}
        onExpandEnd={this.onExpandEnd}
        experimental_flyoutOnHover
      >
        <CollapseStatusListener
          onResizeEnd={this.onResizeEnd}
          onResizeStart={this.onResizeStart}
          onPeek={this.onEmit('onPeek')}
          onUnpeek={this.onEmit('onUnpeek')}
          onPeekHint={this.onEmit('onPeekHint')}
          onUnpeekHint={this.onEmit('onUnpeekHint')}
        />
        <div>
          <ResizeBox width={boxWidth} pending={resizePending} />
          <Logger>
            <button
              style={{ position: 'absolute', right: 10, top: 10 }}
              onClick={() => this.setState({ callStack: [] })}
            >
              Clear
            </button>
            {lastTen.length ? (
              lastTen.map(e => (
                <div key={e.key}>
                  <code>
                    {e.name}({e.value})
                  </code>
                </div>
              ))
            ) : (
              <div>Events logged here...</div>
            )}
          </Logger>
        </div>
      </LayoutManager>
    );
  }
}

const ExtendedNavSubscriber = withNavState(ExtendingNavSubscriber);
export default () => (
  <NavigationProvider>
    <ExtendedNavSubscriber />
  </NavigationProvider>
);
