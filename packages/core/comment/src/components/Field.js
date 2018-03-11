// @flow

import React, { Component, type Node } from 'react';
import { Anchor, Span } from '../styled/FieldStyles';

type Props = {
  hasAuthor?: boolean,
  children?: Node,
  href?: string,
  onClick?: Function,
  onFocus?: Function,
  onMouseOver?: Function,
};

export default class CommentField extends Component<Props> {
  render() {
    const {
      children,
      hasAuthor,
      href,
      onClick,
      onFocus,
      onMouseOver,
    } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return href ? (
      <Anchor
        href={href}
        hasAuthor={hasAuthor}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Anchor>
    ) : (
      <Span
        hasAuthor={hasAuthor}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
