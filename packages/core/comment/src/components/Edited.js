// @flow

import React, { Component, type Node } from 'react';
import EditedStyles from '../styled/EditedStyles';

type Props = {
  /** Content to render indicating that the comment has been edited. */
  children?: Node,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

export default class Edited extends Component<Props, {}> {
  render() {
    const { children, onFocus, onMouseOver } = this.props;
    return (
      <EditedStyles onFocus={onFocus} onMouseOver={onMouseOver}>
        {children}
      </EditedStyles>
    );
  }
}
