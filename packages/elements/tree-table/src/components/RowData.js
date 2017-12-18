// @flow
import React, { PureComponent, type Node } from 'react';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';

type Props = {
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
  depth?: number,
  children: Array<Node>,
};

export default class RowData extends PureComponent<Props> {
  renderCell(cell: Node, cellIndex: number) {
    const { hasChildren, depth, isExpanded } = this.props;
    const isFirst = cellIndex === 0;
    const indentLevel = isFirst ? depth : 0;
    let cellContent = cell.props.children || [];
    if (isFirst) {
      cellContent = [
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onExpandToggle={this.props.onExpandToggle}
        />,
      ].concat(cellContent);
    }
    return React.cloneElement(
      cell,
      {
        key: cellIndex,
        columnIndex: cellIndex,
        indentLevel,
      },
      ...cellContent,
    );
  }

  render() {
    return (
      <TreeRowContainer>
        {React.Children.map(this.props.children, (cell, index) =>
          this.renderCell(cell, index),
        )}
      </TreeRowContainer>
    );
  }
}
