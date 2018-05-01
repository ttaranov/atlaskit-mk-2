// @flow

import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';

type Props = {
  /** The content to render inside the action button. */
  children?: Node,
  /** Handler called when the element is clicked. */
  // flowlint-next-line unclear-type:off
  onClick?: Function,
  /** Handler called when the element is focused. */
  // flowlint-next-line unclear-type:off
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  // flowlint-next-line unclear-type:off
  onMouseOver?: Function,
};

export default class ActionItem extends Component<Props, {}> {
  render() {
    const { children, onClick, onFocus, onMouseOver } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <span onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
        <Button appearance="subtle-link" spacing="none" type="button">
          {children}
        </Button>
      </span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
