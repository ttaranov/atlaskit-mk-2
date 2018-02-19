// @flow

import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import InfoIcon from '@atlaskit/icon/glyph/info';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import SearchIcon from '@atlaskit/icon/glyph/search';
import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Tooltip from '@atlaskit/tooltip';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import AkDropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import AkAvatar from '@atlaskit/avatar';
import nucleusLogo from './utils/images/nucleus.png';
import emmaAvatar from './utils/images/emma.png';
import SelectableDropdownMenu from './utils/SelectableDropdownMenu';
import Navigation, {
  AkCollapseOverflowItem,
  AkCollapseOverflowItemGroup,
  AkCollapseOverflow,
  presetThemes,
  AkContainerTitle,
  AkNavigationItemGroup,
  AkNavigationItem,
  AkSearchDrawer,
  AkCreateDrawer,
  AkGlobalItem,
} from '../src';

const manyNavigationItems = (itemCount = 40) => {
  const items = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(
      <AkCollapseOverflowItem overflowItemIndex={i}>
        <AkNavigationItem
          href={`#${i}`}
          key={i}
          text={`${i} dsf Test page`}
          icon={<InfoIcon size="medium" label="" />}
        />
      </AkCollapseOverflowItem>,
    );
  }
  return items;
};

const manyNavigationItemGroups = (groupCount = 1, itemsPerGroup = 40) => {
  const groups = [];
  for (let i = 0; i < groupCount; i++) {
    groups.push(
      <AkCollapseOverflowItemGroup
        itemCount={itemsPerGroup}
        overflowGroupIndex={i}
      >
        <AkNavigationItemGroup title={`Group ${i}`}>
          {manyNavigationItems(itemsPerGroup)}
        </AkNavigationItemGroup>
      </AkCollapseOverflowItemGroup>,
    );
  }
  return groups;
};

export default class NavigationWithThemeAndOverflow extends React.Component {
  static defaultProps = {
    drawers: [],
    onResizeCallback: () => {},
    onResizeStartCallback: () => {},
    globalPrimaryIcon: <AtlassianIcon label="Atlassian icon" size="large" />,
    children: (
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
    ),
    defaultOpen: true,
    containerHeaderComponent: () => (
      <AkContainerTitle
        href="#foo"
        icon={<img alt="nucleus" src={nucleusLogo} />}
        text="Atlaskit"
        subText="Is the king"
      />
    ),
    createDrawerContent: (
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
    ),
    globalSecondaryActions: [
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
              <AkAvatar
                size="small"
                src={emmaAvatar}
                borderColor="transparent"
              />
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
    ],
  };

  constructor(...args) {
    super(...args);
    this.state = {
      isOpen: this.props.defaultOpen,
      openDrawer: this.props.openDrawer,
      width: this.props.width,
    };
  }

  openDrawer = name => {
    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = resizeState => {
    this.props.onResizeCallback(resizeState);
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  resizeStart = () => {
    action('resizeStart')();
    this.props.onResizeStartCallback();
  };

  render() {
    const backIcon = (
      <Tooltip position="right" content="Back">
        <ArrowLeftIcon label="Back icon" size="medium" />
      </Tooltip>
    );
    const ContainerHeader = this.props.containerHeaderComponent || (() => null);
    return (
      <Navigation
        containerTheme={presetThemes.global}
        globalTheme={this.props.globalTheme}
        containerHeaderComponent={ContainerHeader}
        globalPrimaryIcon={this.props.globalPrimaryIcon}
        globalPrimaryItemHref="//www.atlassian.com"
        globalSecondaryActions={this.props.globalSecondaryActions}
        isOpen={this.state.isOpen}
        onResize={this.resize}
        onResizeStart={this.resizeStart}
        openDrawer={this.state.openDrawer}
        position="right bottom"
        width={this.state.width}
        {...this.props}
        /** Reverse which global primary actions props nav uses by defult. i.e. use new
         `globalPrimaryActions` prop unless old API is explicitly used */
        globalPrimaryActions={
          !this.props.globalSearchIcon || !this.props.globalCreateIcon
            ? [
                ...(this.props.globalPrimaryActions
                  ? this.props.globalPrimaryActions
                  : []),
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
                    <AddIcon
                      label="Create icon"
                      secondaryColor="inherit"
                      size="medium"
                    />
                  </Tooltip>
                </AkGlobalItem>,
              ]
            : null
        }
        drawers={[
          ...this.props.drawers,
          <AkSearchDrawer
            backIcon={backIcon}
            isOpen={this.state.openDrawer === 'search'}
            key="search"
            onBackButton={this.closeDrawer}
            primaryIcon={this.props.globalPrimaryIcon}
          >
            {this.props.searchDrawerContent
              ? this.props.searchDrawerContent
              : null}
          </AkSearchDrawer>,
          <AkCreateDrawer
            backIcon={backIcon}
            header={<ContainerHeader />}
            isOpen={this.state.openDrawer === 'create'}
            key="create"
            onBackButton={this.closeDrawer}
            primaryIcon={this.props.globalPrimaryIcon}
          >
            {this.props.createDrawerContent}
          </AkCreateDrawer>,
        ]}
      >
        <AkCollapseOverflow groupCount={15}>
          {manyNavigationItemGroups(15, 3)}
        </AkCollapseOverflow>
      </Navigation>
    );
  }
}
