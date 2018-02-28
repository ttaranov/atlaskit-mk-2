// @flow

import React, { type Node } from 'react';
import SubtleLink from './SubtleLink';

type Props = {
  /** The content to render inside the action button. */
  children?: Node,
  /** Handler called when the element is clicked. */
  onClick?: Function,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

const ActionItem = ({ children, onClick, onFocus, onMouseOver }: Props) => (
  <SubtleLink
    onClick={onClick}
    onFocus={onFocus}
    onMouseOver={onMouseOver}
    analyticsContext={{ component: 'comment-action' }}
  >
    {children}
  </SubtleLink>
);

export default ActionItem;
