// @flow
import React, { PureComponent, type Element, type Node } from 'react';
import { TreeRowContainer, TreeCell } from '../styled';
import Chevron from './Chevron';

type Props = {
  columnWidths?: Array<string>,
  data?: Object,
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
  depth?: number,
  children: Array<Node>,
};

export default class RowData extends PureComponent<Props> {
  renderCell(cell, index) {
    const { hasChildren, depth, isExpanded, columnWidths } = this.props;

    const isFirst = index === 0;
    const width = (columnWidths && columnWidths[index]) || '200px'; //`${(1 / columns.length) * 100}%`;
    const indentLevel = isFirst ? depth : 0;
    const chevron = isFirst &&
      cell.props.children && (
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          hasChildren={hasChildren}
          onExpandToggle={this.props.onExpandToggle}
        />
      );

    const enhancedCellChildren = chevron
      ? [chevron].concat(cell.props.children)
      : cell.props.children;

    return React.cloneElement(
      cell,
      {
        key: index,
        indentLevel,
        width,
      },
      ...enhancedCellChildren,
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
