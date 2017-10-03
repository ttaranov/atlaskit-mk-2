// @flow
import React, { type Node } from 'react';
import Container from '../styled/Container';

const ALIGNMENT = {
  values: ['start', 'end'],
  defaultValue: 'start',
};

type Props = {
  /** Whether the tags should be left-aligned or right-aligned. */
  alignment: 'start' | 'end',
  /** Tags to render within the tag group. */
  children: Node,
};

export default class TagGroup extends React.PureComponent<Props> {
  static defaultProps = {
    alignment: ALIGNMENT.defaultValue,
  }

  render() {
    const { alignment, children } = this.props;

    return (
      <Container justify={alignment}>
        {children}
      </Container>
    );
  }
}
