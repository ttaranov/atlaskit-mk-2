// @flow
import React, { PureComponent, type Element, type ChildrenArray } from 'react';
// import {
//   withAnalyticsEvents,
//   withAnalyticsContext,
//   createAndFireEvent,
// } from '@atlaskit/analytics-next';
// import {
//   name as packageName,
//   version as packageVersion,
// } from '../../package.json';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';
import Cell from './Cell';
import toItemId from '../utils/toItemId';
import { type RowData } from '../types';

type Props = {
  /** Whether this row has any child rows. */
  hasChildren: boolean,

  /** One or more Cell elements that will form this row of data. */
  children: Node | ChildrenArray<Element<*>>,

  /** Unique, stable ID for the row. Can be used for accessibility, caching etc. */
  itemId: string,

  /** Called whenever this row's node is expanded to show its child rows. */
  onExpand?: RowData => void,

  /** Called whenever this row's node is expanded to show its child rows. */
  onExpand?: Function,

  /** Called whenever this row's node is collapsed to hide its child rows. */
  onCollapse?: RowData => void,

  /** Passed implicitly. Whether the children of this row should currently be visible. */
  isExpanded?: boolean,

  /** Passed implicitly. Called whenever the current row gets expanded or collapsed. */
  onExpandToggle?: Function,

  /** Passed implicitly. The tree-depth (nesting level) of the current row. Used to calculate the indent. */
  depth?: number,

  /** Passed implicitly. The data that this row represents. */
  data?: RowData,
};

class Row extends PureComponent<Props> {
  componentWillUpdate(nextProps: Props) {
    const isExpandChanged =
      Boolean(nextProps.isExpanded) !== Boolean(this.props.isExpanded);
    if (!isExpandChanged || !nextProps.data) {
      return;
    }
    if (nextProps.isExpanded && this.props.onExpand) {
      this.props.onExpand(nextProps.data);
    } else if (!nextProps.isExpanded && this.props.onCollapse) {
      this.props.onCollapse(nextProps.data);
    }
  }

  renderCell(cell: Element<typeof Cell>, cellIndex: number) {
    const { hasChildren, depth, isExpanded = false } = this.props;
    const isFirstCell = cellIndex === 0;
    const indentLevel = isFirstCell ? depth : 0;
    let cellContent = cell.props.children || [];
    if (isFirstCell && hasChildren) {
      cellContent = [
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          onExpandToggle={this.props.onExpandToggle}
          ariaControls={toItemId(this.props.itemId)}
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
    const { hasChildren, isExpanded, depth } = this.props;
    const ariaAttrs = {};
    if (hasChildren) {
      ariaAttrs['aria-expanded'] = isExpanded;
    }
    if (depth !== undefined) {
      ariaAttrs['aria-level'] = depth;
    }
    return (
      <TreeRowContainer role={'row'} {...ariaAttrs}>
        {React.Children.map(this.props.children, (cell, index) =>
          this.renderCell(cell, index),
        )}
      </TreeRowContainer>
    );
  }
}

export { Row as RowBase };

export default Row;

// const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
//
// $FlowFixMe - Figure out why this is erroring only for this component...
// export default withAnalyticsContext({
//   component: 'table-tree',
//   package: packageName,
//   version: packageVersion,
// })(
//   withAnalyticsEvents({
//     onExpand: createAndFireEventOnAtlaskit({
//       action: 'toggle',
//     }),

//     onCollapse: createAndFireEventOnAtlaskit({
//       action: 'toggle',
//     }),
//   })(Row),
// );
