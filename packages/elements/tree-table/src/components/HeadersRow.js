// @flow
import React, { PureComponent, type Node } from 'react';

import { TreeRowContainer } from '../styled';

type Props = {
  children: Array<Node>,
};

export default class HeadersRows extends PureComponent<Props> {
  render() {
    return (
      <TreeRowContainer>
        {React.Children.map(this.props.children, (head, index) =>
          React.cloneElement(head, { key: index, index }),
        )}
      </TreeRowContainer>
    );
  }
}
