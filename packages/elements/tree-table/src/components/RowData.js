// @flow
import React, { PureComponent, type Node } from 'react';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';

type Props = {
  columnWidths?: Array<string>,
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
  depth?: number,
  children: Array<Node>,
};

export default class RowData extends PureComponent<Props> {
  renderCell(cell, cellIndex) {
    const { hasChildren, depth, isExpanded, columnWidths } = this.props;
    const isFirst = cellIndex === 0;
    const width = (columnWidths && columnWidths[cellIndex]) || '200px'; //`${(1 / columns.length) * 100}%`;
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
        indentLevel,
        width,
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
