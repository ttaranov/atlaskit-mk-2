// @flow

import React, { Component, type Node } from 'react';
import ActionItem from './ActionItem';

type Props = {
  /** Content to render indicating that the comment has been edited. */
  children?: Node,
  /** Handler called when the element is clicked. */
  onClick?: Function,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

export default class Edited extends Component<Props, {}> {
  render() {
    const { children, onClick, onFocus, onMouseOver } = this.props;
    return (
      <ActionItem onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
        {children}
      </ActionItem>
    );
  }
}
