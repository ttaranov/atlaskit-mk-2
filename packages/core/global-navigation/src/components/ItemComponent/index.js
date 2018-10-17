// @flow

import React, { Component, type ComponentType, type Node } from 'react';
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';
import { GlobalItem } from '@atlaskit/navigation-next';

import type { GlobalNavItemData } from '../../config/types';

type DropdownItemProps = {
  items: Node,
  trigger: ComponentType<{ isOpen: boolean }>,
};
type DropdownItemState = { isOpen: boolean };
class DropdownItem extends Component<DropdownItemProps, DropdownItemState> {
  state = {
    isOpen: false,
  };
  handleOpenChange = ({ isOpen }) => this.setState({ isOpen });
  render() {
    const { items, trigger: Trigger } = this.props;
    const { isOpen } = this.state;
    return (
      <DropdownMenuStateless
        appearance="tall"
        boundariesElement="window"
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        position="right bottom"
        trigger={<Trigger isOpen={isOpen} />}
      >
        {items}
      </DropdownMenuStateless>
    );
  }
}

export default (props: GlobalNavItemData) => {
  const {
    dropdownItems: DropdownItems,
    itemComponent: CustomItemComponent,
    ...itemProps
  } = props;
  if (CustomItemComponent) {
    return <CustomItemComponent {...itemProps} />;
  }
  if (DropdownItems) {
    return (
      <DropdownItem
        trigger={({ isOpen }) => (
          <GlobalItem isSelected={isOpen} {...itemProps} />
        )}
        items={<DropdownItems />}
      />
    );
  }
  return <GlobalItem {...itemProps} />;
};
