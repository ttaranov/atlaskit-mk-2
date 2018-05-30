// @flow
import React, { Component, type Node } from 'react';
import Avatar from '@atlaskit/avatar';
import Item from '@atlaskit/item';

type Props = {
  /** Room name */
  roomName: Node,
  /** Description of the room */
  description: string,
  /** Room image */
  image?: string,
  /** Room image size */
  size?: string,
  /** Room actions: close, new messages */
  actions?: Node,
};

export default class RoomItem extends Component<Props> {
  props: Props;

  static defaultProps = {
    roomName: '',
    description: '',
  };

  render() {
    const children = this.props.roomName;
    return (
      <div>
        <Item
          description={this.props.description}
          elemBefore={
            <Avatar
              src={this.props.image}
              appearance="square"
              size={this.props.size}
            />
          }
          elemAfter={this.props.actions}
        >
          {children}
        </Item>
      </div>
    );
  }
}
