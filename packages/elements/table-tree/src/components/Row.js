// @flow
import React, { PureComponent, type Element } from 'react';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';
import Cell from './Cell';

type Props = {
  /** Whether this row has any child rows. */
  hasChildren: boolean,

  /** One or more Cell elements that will form this row of data. */
  children: Node,

  /** Whether the children of this row should currently be visible. */
  isExpanded?: boolean,

  /** Called whenever the current row gets expanded or collapsed. */
  onExpandToggle?: Function,

  /** The tree-depth (nesting level) of the current row. Used to calculate the indent. */
  depth?: number,
};

export default class Row extends PureComponent<Props> {
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
