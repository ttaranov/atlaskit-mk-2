// @flow
import React, { PureComponent, type Element, type Node } from 'react';

import RowChildren from './RowChildren';
import RowData from './RowData';
import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  columnWidths?: Array<string>,
  data: Object,
  getChildrenData: DataFunction,
  hasChildren: boolean,
  isExpanded?: boolean,
  depth?: number,
  render?: Function,
  children?: Array<Node>,
};

export default class Subtree extends PureComponent<Props> {
  state = {
    isExpanded: false,
    childrenData: null,
  };

  static defaultProps = {
    depth: 1,
  };

  constructor() {
    super();
    this.handleExpandToggleClick = this.handleExpandToggleClick.bind(this);
  }

  handleExpandToggleClick() {
    const childrenData = this.props.getChildrenData(this.props.data);
    this.setState({
      childrenData,
      isExpanded: !this.state.isExpanded,
    });
  }

  renderRowChildren() {
    const {
      columns,
      getChildrenData,
      depth,
      columnWidths,
      render,
    } = this.props;
    const { isExpanded, childrenData } = this.state;
    return (
      isExpanded && (
        <RowChildren
          childrenData={childrenData}
          columns={columns}
          columnWidths={columnWidths}
          getChildrenData={getChildrenData}
          isExpanded={isExpanded}
          depth={depth}
          render={render}
        />
      )
    );
  }

  render() {
    const {
      hasChildren,
      depth,
      columnWidths,
      columns,
      data,
      render,
    } = this.props;

    let rowData = null;
    const rowProps = {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      hasChildren,
      columnWidths,
      data: data.content,
      columns,
      isExpanded: this.state.isExpanded,
    };
    if (render) {
      rowData = render(data.content);
      rowData = React.cloneElement(rowData, rowProps);
    } else if (columns) {
      rowData = <RowData {...rowProps} />;
    }
    return rowData ? (
      <div>
        {rowData}
        {this.renderRowChildren()}
      </div>
    ) : (
      <div>{this.props.children}</div>
    );
  }
}
