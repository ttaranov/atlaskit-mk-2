// @flow
import React, { PureComponent, type Node } from 'react';
import { Container } from './styled';

type Props = {
  /** Whether the tags should be left-aligned or right-aligned. */
  alignment?: 'start' | 'end',
  /** Tags to render within the tag group. */
  children: Node,
};

export default function TagGroup (props) {
  static defaultProps = {
    alignment: 'start',
  };

  render() {
    const { alignment, children } = this.props;

    return <Container justify={alignment}>{children}</Container>;
  }
}
