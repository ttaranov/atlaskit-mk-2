// @flow
import React, { PureComponent, type ChildrenArray, type Element } from 'react';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';
import Header from './Header';
import Cell from './DataCell';

type Props = {
  isExpanded?: boolean,
  hasChildren: boolean,
  onExpandToggle?: Function,
  depth?: number,
  children: ChildrenArray<Element<typeof Header>>,
};

export default class RowData extends PureComponent<Props> {
  renderCell(cell: Element<typeof Cell>, cellIndex: number) {
    const { hasChildren, depth, isExpanded = false } = this.props;
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
      cellContent,
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

export type RowDataComponentType = RowData;
