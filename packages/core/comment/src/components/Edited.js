// @flow

import React, { type Node } from 'react';
import SubtleLink from './SubtleLink';

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

const Edited = ({ children, onClick, onFocus, onMouseOver }: Props) => (
  <SubtleLink
    onClick={onClick}
    onFocus={onFocus}
    onMouseOver={onMouseOver}
    analyticsContext={{ component: 'comment-edited' }}
  >
    {children}
  </SubtleLink>
);

export default Edited;
