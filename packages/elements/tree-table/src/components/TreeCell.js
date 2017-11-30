// @flow
import React, { PureComponent, type Node } from 'react';

import { TreeCell as StyledTreeCell } from '../styled';
import withColumnWidth from './withColumnWidth';

type Props = {
  children: Array<Node>,
  columnWidth: number,
};

class TreeHead extends PureComponent<Props> {
  render() {
    return (
      <StyledTreeCell {...this.props} width={this.props.columnWidth}>
        {this.props.children}
      </StyledTreeCell>
    );
  }
}

export default withColumnWidth(TreeHead);
