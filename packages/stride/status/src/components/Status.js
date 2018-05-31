// @flow
import React, { Component, type Node } from 'react';
import Avatar from '@atlaskit/avatar';
import Dropdown, {
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';

type Props = {
  // /** Room name */
  // roomName: Node,
  // /** Description of the room */
  // description: string,
  // /** Room image */
  // image?: string,
  // /** Room image size */
  // size?: string,
  // /** Room actions: close, new messages */
  // actions?: Node,
};

export default class Status extends Component<Props> {
  props: Props;

  static defaultProps = {
    // roomName: '',
    // description: '',
  };

  render() {
    // const children = this.props.roomName;
    return <div>Hello</div>;
  }
}
