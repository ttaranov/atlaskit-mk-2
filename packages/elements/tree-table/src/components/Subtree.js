// @flow
import React, { PureComponent } from 'react';

import RowChildren from './RowChildren';
import { type DataFunction } from './../types';

type Props = {
  columnWidths?: Array<string>,
  data: Object,
  getChildrenData: DataFunction,
  hasChildren: boolean,
  depth?: number,
  render: Function,
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
    const { getChildrenData, depth, columnWidths, render } = this.props;
    const { isExpanded, childrenData } = this.state;
    return (
      isExpanded && (
        <RowChildren
          childrenData={childrenData}
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
    const { depth, columnWidths, data, render } = this.props;

    const rowProps = {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      columnWidths,
      data,
      isExpanded: this.state.isExpanded,
    };
    let rowData = render(data);
    if (!rowData) {
      return null;
    }
    rowData = React.cloneElement(rowData, rowProps);
    const key = rowData.props.key;
    return (
      <div key={key}>
        {rowData}
        {this.renderRowChildren()}
      </div>
    );
  }
}
