// @flow
import React, { PureComponent, type Node } from 'react';
import { Link, Text } from '../styled/Content';
import type { TagColor } from '../types';

type Props = {
  children: Node,
  href?: string,
  isFocused?: bool,
  isRemovable?: bool,
  markedForRemoval?: bool,
  color: TagColor,
};

export default class Content extends PureComponent<Props> {
  render() {
    const { children, href, isFocused, isRemovable, markedForRemoval, color } = this.props;
    const styledProps = { isFocused, isRemovable, markedForRemoval, color };

    return href ? (
      <Link {...styledProps} href={href} tabIndex="-1">
        {children}
      </Link>
    ) : (
      <Text {...styledProps}>{children}</Text>
    );
  }
}
