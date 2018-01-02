// @flow
import React, { PureComponent, type Element, type ChildrenArray } from 'react';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';
import Cell from './Cell';

type Props = {
  /** Whether this row has any child rows. */
  hasChildren: boolean,

  /** One or more Cell elements that will form this row of data. */
  children: Node | ChildrenArray<Element<*>>,

  onExpand?: Function,

  /** Called whenever this row's node is collapsed to hide its child rows. */
  onCollapse?: Function,

  /** Passed implicitly. Whether the children of this row should currently be visible. */
  isExpanded?: boolean,

  /** Passed implicitly. Called whenever the current row gets expanded or collapsed. */
  onExpandToggle?: Function,

  /** Passed implicitly. The tree-depth (nesting level) of the current row. Used to calculate the indent. */
  depth?: number,
};

export default class Row extends PureComponent<Props> {
  componentWillUpdate(nextProps: Props) {
    const isExpandChanged =
      Boolean(nextProps.isExpanded) !== Boolean(this.props.isExpanded);
    if (!isExpandChanged) {
      return;
    }
    if (nextProps.isExpanded && this.props.onExpand) {
      this.props.onExpand();
    } else if (!nextProps.isExpanded && this.props.onCollapse) {
      this.props.onCollapse();
    }
  }

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
