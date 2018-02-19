// @flow
import React, { Component } from 'react';
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';

type TriggerFunc = (isOpen: boolean) => void;
type OpenState = { isOpen: boolean };

/** This is just a handy little HoC around DropdownMenu which creates a stateful menu
 and turns the trigger prop into a render prop, passing in the isOpen state. */
export default class SelectableDropdownMenu extends Component {
  // eslint-disable-next-line react/sort-comp
  props: {
    children: TriggerFunc | any,
    items?: any,
    onOpenChange?: (openState: OpenState) => void,
    trigger?: TriggerFunc,
  };

  state: {
    isOpen: boolean,
  } = {
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
