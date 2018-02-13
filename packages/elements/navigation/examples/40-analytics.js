// @flow

import React, { Component } from 'react';

import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import SearchIcon from '@atlaskit/icon/glyph/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import AddIcon from '@atlaskit/icon/glyph/add';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import AkDropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
  DropdownMenuStateless,
} from '@atlaskit/dropdown-menu';
import AkAvatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import Navigation, {
  AkContainerTitle,
  AkNavigationItemGroup,
  AkNavigationItem,
  AkSearchDrawer,
  AkCreateDrawer,
  AkGlobalItem,
} from '../src';

type OpenState = { isOpen: boolean };
type SelectableDropdownMenuProps = {
  children: any,
  items?: any,
  onOpenChange?: (openState: OpenState) => void,
  trigger?: any,
};
type SelectableDropdownMenuState = OpenState;

/** This is just a handy little HoC around DropdownMenu which creates a stateful menu
 and turns the trigger prop into a render prop, passing in the isOpen state. */
class SelectableDropdownMenu extends Component<
  SelectableDropdownMenuProps,
  SelectableDropdownMenuState,
> {
  state = {
    isOpen: false,
  };

  onOpenChange = (openState: OpenState) => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange(openState);
    }
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const isUsingDeprecatedAPI = Boolean(
      this.props.items && this.props.items.length,
    );

    return isUsingDeprecatedAPI ? (
      <DropdownMenuStateless
        {...this.props}
        isOpen={isOpen}
        onOpenChange={this.onOpenChange}
      >
        {this.props.children(isOpen)}
      </DropdownMenuStateless>
    ) : (
      <DropdownMenuStateless
        {...this.props}
        isOpen={isOpen}
        onOpenChange={this.onOpenChange}
        trigger={this.props.trigger && this.props.trigger(isOpen)}
      />
    );
  }
}

const nucleusLogo = 'https://imgur.com/fzWCII9.png';

const backIcon = (
  <Tooltip position="right" content="Back">
    <ArrowLeftIcon label="Back icon" size="medium" />
  </Tooltip>
);

const ContainerHeaderComponent = () => (
  <AkContainerTitle
    href="#foo"
    icon={<img alt="nucleus" src={nucleusLogo} />}
    text="Atlaskit"
    subText="Is the king"
  />
);

const globalPrimaryIcon = <AtlassianIcon label="Atlassian icon" size="large" />;

const globalSecondaryActions = [
  <Tooltip position="right" content="Help">
    <SelectableDropdownMenu
      appearance="tall"
      position="right bottom"
      trigger={isOpen => (
        <AkGlobalItem isSelected={isOpen}>
          <QuestionCircleIcon
            label="Help icon"
            secondaryColor="inherit"
            size="medium"
          />
        </AkGlobalItem>
      )}
    >
      <DropdownItemGroup title="Help">
        <DropdownItem>Documentation</DropdownItem>
        <DropdownItem>Learn Git</DropdownItem>
        <DropdownItem>Keyboard shortcuts</DropdownItem>
        <DropdownItem>Bitbucket tutorials</DropdownItem>
        <DropdownItem>API</DropdownItem>
        <DropdownItem>Support</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup title="Information">
        <DropdownItem>Latest features</DropdownItem>
        <DropdownItem>Blog</DropdownItem>
        <DropdownItem>Plans and pricing</DropdownItem>
        <DropdownItem>Site status</DropdownItem>
        <DropdownItem>Version info</DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup title="Legal">
        <DropdownItem>Terms of service</DropdownItem>
        <DropdownItem>Privacy policy</DropdownItem>
      </DropdownItemGroup>
    </SelectableDropdownMenu>
  </Tooltip>,
  <AkDropdownMenu
    appearance="tall"
    position="right bottom"
    trigger={
      <AkGlobalItem>
        <Tooltip position="right" content="User profile">
          <AkAvatar size="small" borderColor="transparent" />
        </Tooltip>
      </AkGlobalItem>
    }
  >
    <DropdownItemGroup title="Luke Skywalker">
      <DropdownItem>View profile</DropdownItem>
      <DropdownItem>Manage Atlassian account</DropdownItem>
      <DropdownItem>Bitbucket settings</DropdownItem>
      <DropdownItem>Integrations</DropdownItem>
      <DropdownItem>Bitbucket labs</DropdownItem>
      <DropdownItem>Log out</DropdownItem>
    </DropdownItemGroup>
  </AkDropdownMenu>,
];

const children = (
  <div>
    <AkNavigationItem
      icon={<DashboardIcon label="Dashboard" secondaryColor="inherit" />}
      text="Item A"
    />
    <AkNavigationItem
      icon={<SettingsIcon label="Settings" secondaryColor="inherit" />}
      isSelected
      text="Selected item"
    />
    <AkNavigationItem
      icon={<IssuesIcon label="Projects" secondaryColor="inherit" />}
      text="Item C"
    />
  </div>
);

const createDrawerContent = (
  <div>
    <AkNavigationItem text="Item outside a group" />
    <AkNavigationItemGroup title="Create item group">
      <AkNavigationItem
        icon={<img alt="icon" src={nucleusLogo} />}
        text="Item with an icon"
      />
      <AkNavigationItem
        icon={<img alt="icon" src={nucleusLogo} />}
        text="A really, really, quite long, actually super long container name"
      />
    </AkNavigationItemGroup>
  </div>
);

type State = {
  isOpen: boolean,
  openDrawer: string | null,
  width?: number,
};

type ResizeState = {
  isOpen: boolean,
  width: number,
};

// eslint-disable-next-line react/no-multi-comp
export default class BasicNavigation extends Component<{}, State> {
  state = {
    isOpen: true,
    openDrawer: null,
  };

  openDrawer = (name: string) => {
    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = (resizeState: ResizeState) => {
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  render() {
    const drawers = [
      <AkSearchDrawer
        backIcon={backIcon}
        isOpen={this.state.openDrawer === 'search'}
        key="search"
        onBackButton={this.closeDrawer}
        primaryIcon={globalPrimaryIcon}
      >
        {/* <BasicSearch /> */}
      </AkSearchDrawer>,
      <AkCreateDrawer
        backIcon={backIcon}
        header={<ContainerHeaderComponent />}
        isOpen={this.state.openDrawer === 'create'}
        key="create"
        onBackButton={this.closeDrawer}
        primaryIcon={globalPrimaryIcon}
      >
        {createDrawerContent}
      </AkCreateDrawer>,
    ];

    const globalPrimaryActions = [
      <AkGlobalItem
        size="medium"
        onClick={() => {
          this.openDrawer('search');
        }}
      >
        <Tooltip position="right" content="Search">
          <SearchIcon
            label="Search icon"
            secondaryColor="inherit"
            size="medium"
          />
        </Tooltip>
      </AkGlobalItem>,
      <AkGlobalItem
        size="medium"
        onClick={() => {
          this.openDrawer('create');
        }}
      >
        <Tooltip position="right" content="Create">
          <AddIcon label="Create icon" secondaryColor="inherit" size="medium" />
        </Tooltip>
      </AkGlobalItem>,
    ];

    return (
      <AnalyticsListener
        channel="atlaskit"
        onEvent={analyticsEvent => {
          const { context, payload } = analyticsEvent;
          console.log(payload, context);
        }}
      >
        <div
          style={{
            height: '100%',
            left: '0',
            position: 'fixed',
            top: '0',
            width: '100%',
            zIndex: '10',
          }}
        >
          <Navigation
            containerHeaderComponent={ContainerHeaderComponent}
            drawers={drawers}
            globalPrimaryActions={globalPrimaryActions}
            // globalPrimaryIcon={globalPrimaryIcon}
            globalPrimaryItemHref="//www.atlassian.com"
            globalSecondaryActions={globalSecondaryActions}
            isOpen={this.state.isOpen}
            onResize={this.resize}
            openDrawer={this.state.openDrawer}
            width={this.state.width || undefined}
          >
            {children}
          </Navigation>
        </div>
      </AnalyticsListener>
    );
  }
}
