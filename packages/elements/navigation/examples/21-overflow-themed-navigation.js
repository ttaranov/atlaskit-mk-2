// @flow

import React, { Component, type Node } from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import InfoIcon from '@atlaskit/icon/glyph/info';
import SearchIcon from '@atlaskit/icon/glyph/search';
import AddIcon from '@atlaskit/icon/glyph/add';
import Tooltip from '@atlaskit/tooltip';
import AkDropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import AkAvatar from '@atlaskit/avatar';
import nucleusLogo from './utils/images/nucleus.png';
import emmaAvatar from './utils/images/emma.png';
import Navigation, {
  AkCollapseOverflowItem,
  AkCollapseOverflowItemGroup,
  AkCollapseOverflow,
  presetThemes,
  AkContainerTitle,
  AkNavigationItemGroup,
  AkNavigationItem,
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
          text={`${i} Test page`}
          icon={
            <InfoIcon
              size="medium"
              label=""
              primaryColor="inherit"
              secondaryColor="inherit"
            />
          }
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

type Props = {
  containerHeaderComponent: Function,
  defaultOpen: boolean,
  globalSecondaryActions: Array<Node>,
  globalTheme: Object,
  globalPrimaryIcon: Node,
};

type State = {
  isOpen: boolean,
};

export default class NavigationWithThemeAndOverflow extends Component<
  Props,
  State,
> {
  static defaultProps = {
    globalPrimaryIcon: <AtlassianIcon label="Atlassian icon" size="large" />,
    defaultOpen: false,
    containerHeaderComponent: () => (
      <AkContainerTitle
        href="#foo"
        icon={<img alt="nucleus" src={nucleusLogo} />}
        text="Atlaskit"
        subText="Is the king"
      />
    ),
    globalSecondaryActions: [
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
          <DropdownItem>Log out</DropdownItem>
        </DropdownItemGroup>
      </AkDropdownMenu>,
    ],
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: this.props.defaultOpen,
    };
  }

  resize = (resizeState: { isOpen: boolean }) => {
    this.setState({
      isOpen: resizeState.isOpen,
    });
  };

  render() {
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
        globalPrimaryActions={[
          <AkGlobalItem size="medium">
            <Tooltip position="right" content="Search">
              <SearchIcon
                label="Search icon"
                secondaryColor="inherit"
                size="medium"
              />
            </Tooltip>
          </AkGlobalItem>,
          <AkGlobalItem size="medium">
            <Tooltip position="right" content="Create">
              <AddIcon
                label="Create icon"
                secondaryColor="inherit"
                size="medium"
              />
            </Tooltip>
          </AkGlobalItem>,
        ]}
      >
        <AkCollapseOverflow groupCount={15}>
          {manyNavigationItemGroups(15, 3)}
        </AkCollapseOverflow>
      </Navigation>
    );
  }
}
