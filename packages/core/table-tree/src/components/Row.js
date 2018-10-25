// @flow
import React, {
  Fragment,
  Component,
  type Element,
  type ChildrenArray,
  type Node,
} from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { TreeRowContainer } from '../styled';
import Chevron from './Chevron';
import Cell from './Cell';
import toItemId from '../utils/toItemId';
import type { RowData, LoadableItems } from '../types';

type Props = {
  /** Whether this row has any child rows. */
  hasChildren: boolean,
  /** One or more Cell elements that will form this row of data. */
  children: Node | ChildrenArray<Element<*>>,

  /** Unique, stable ID for the row. Can be used for accessibility, caching etc. */
  itemId: string,

  /** Called whenever this row's node is expanded to show its child rows. */
  onExpand?: RowData => void,

  /** Called whenever this row's node is collapsed to hide its child rows. */
  onCollapse?: RowData => void,

  /** Accessibility. Label used for the Expand button (chevron). */
  expandLabel?: string,

  /** Accessibility. Label used for the Collapse button (chevron). */
  collapseLabel?: string,

  /** Whether the children of this row should currently be visible. */
  isExpanded?: boolean,

  /** Whether the children of this row should be visible by default. */
  isDefaultExpanded?: boolean,

  /** Passed implicitly. The tree-depth (nesting level) of the current row. Used to calculate the indent. */
  depth?: number,

  /** Passed implicitly. The data that this row represents. */
  data?: RowData,

  /** Array of object of the children of expended parent item */
  items?: LoadableItems,

  /** Passed implicitly. Method retrieves children of the row. */
  renderChildren?: () => Node,
};

type State = {
  isExpanded: boolean,
};

class Row extends Component<Props, State> {
  state = { isExpanded: this.props.isDefaultExpanded || false };

  componentDidUpdate(prevProps: Props) {
    const { isDefaultExpanded, isExpanded } = this.props;

    if (
      isExpanded === undefined &&
      isDefaultExpanded !== undefined &&
      prevProps.isDefaultExpanded !== isDefaultExpanded &&
      this.state.isExpanded !== isDefaultExpanded
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isExpanded: isDefaultExpanded });
    }
  }

  onExpandStateChange(isExpanded: boolean) {
    if (this.props.data) {
      if (isExpanded && this.props.onExpand) {
        this.props.onExpand(this.props.data);
      } else if (!isExpanded && this.props.onCollapse) {
        this.props.onCollapse(this.props.data);
      }
    }
  }

  onExpandToggle = () => {
    const { isExpanded } = this.props;

    if (isExpanded !== undefined) {
      this.onExpandStateChange(!isExpanded);
    } else {
      this.setState({ isExpanded: !this.state.isExpanded });
      this.onExpandStateChange(!this.state.isExpanded);
    }
  };

  isExpanded(): boolean {
    const { isExpanded } = this.props;

    return isExpanded !== undefined ? isExpanded : this.state.isExpanded;
  }

  renderCell(cell: Element<typeof Cell>, cellIndex: number) {
    const props = this.props;
    const isExpanded = this.isExpanded();
    const { hasChildren, depth } = props;
    const isFirstCell = cellIndex === 0;
    const indentLevel = isFirstCell ? depth : 0;
    let cellContent = cell.props.children || [];
    if (isFirstCell && hasChildren) {
      cellContent = [
        <Chevron
          key="chevron"
          expandLabel={props.expandLabel}
          collapseLabel={props.collapseLabel}
          isExpanded={isExpanded}
          onExpandToggle={this.onExpandToggle}
          ariaControls={toItemId(props.itemId)}
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
    const { hasChildren, depth, renderChildren } = this.props;
    const isExpanded = this.isExpanded();
    const ariaAttrs = {};
    if (hasChildren) {
      ariaAttrs['aria-expanded'] = isExpanded;
    }
    if (depth !== undefined) {
      ariaAttrs['aria-level'] = depth;
    }
    return (
      <Fragment>
        <TreeRowContainer role={'row'} {...ariaAttrs}>
          {React.Children.map(this.props.children, (cell, index) =>
            this.renderCell(cell, index),
          )}
        </TreeRowContainer>
        {hasChildren && isExpanded && renderChildren && renderChildren()}
      </Fragment>
    );
  }
}

export { Row as RowWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'row',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expanded',
      actionSubject: 'tableTree',

      attributes: {
        componentName: 'row',
        packageName,
        packageVersion,
      },
    }),

    onCollapse: createAndFireEventOnAtlaskit({
      action: 'collapsed',
      actionSubject: 'tableTree',

      attributes: {
        componentName: 'row',
        packageName,
        packageVersion,
      },
    }),
  })(Row),
);
