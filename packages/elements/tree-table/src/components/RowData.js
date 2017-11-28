// @flow
import React, { PureComponent, type Element, type Node } from 'react';
import { TreeRowContainer, TreeCell } from '../styled';
import Chevron from './Chevron';

type Props = {
  columns: Array<Element>,
  columnWidths?: Array<string>,
  data?: Object,
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
  depth?: number,
  children: Array<Node>,
};

export default class RowData extends PureComponent<Props> {
  renderChildrenCells() {
    const {
      children,
      hasChildren,
      depth,
      isExpanded,
      columnWidths,
    } = this.props;
    return React.Children.map(children, (cell, index) => {
      const isFirstCell = index === 0;
      const width = (columnWidths && columnWidths[index]) || '200px'; //`${(1 / columns.length) * 100}%`;
      const indentLevel = isFirstCell ? depth : 0;
      const chevron = isFirstCell &&
        cell.props.children && (
          <Chevron
            key="chevron"
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onExpandToggle={this.props.onExpandToggle}
          />
        );

      return React.cloneElement(cell, {
        key: index,
        indentLevel,
        width,
        children: chevron
          ? [chevron, ...cell.props.children]
          : cell.props.children,
      });
    });
  }

  renderCellsFromColumns() {
    const {
      data,
      columns,
      isExpanded,
      onExpandToggle,
      hasChildren,
      depth,
      columnWidths,
    } = this.props;
    if (!columns) {
      return null;
    }

    return (
      columns &&
      columns.map((ColumnComponent, columnIndex) => {
        const firstCell = columnIndex === 0;
        const width = (columnWidths && columnWidths[columnIndex]) || '200px'; //`${(1 / columns.length) * 100}%`;
        const indentLevel = firstCell ? depth : 0;
        return (
          <TreeCell
            width={width}
            indentLevel={indentLevel}
            key={columnIndex}
            className={'tree-cell'}
          >
            {firstCell ? (
              <Chevron
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                onExpandToggle={onExpandToggle}
              />
            ) : null}
            <ColumnComponent {...data} />
          </TreeCell>
        );
      })
    );
  }

  render() {
    return (
      <TreeRowContainer>
        {this.renderCellsFromColumns() || this.renderChildrenCells()}
      </TreeRowContainer>
    );
  }
}
