// @flow
import React, { PureComponent, type Element } from 'react';

import TreeChildren from './TreeChildren';
import TreeRow from './TreeRow';
import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  columnWidths?: Array<string>,
  data: Object,
  getChildrenData: DataFunction,
  hasChildren: boolean,
  depth?: number,
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

  render() {
    const {
      data,
      columns,
      getChildrenData,
      hasChildren,
      depth,
      columnWidths,
    } = this.props;
    const { isExpanded, childrenData } = this.state;

    return (
      <div>
        <TreeRow
          data={data.content}
          columns={columns}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          depth={depth}
          onExpandToggle={this.handleExpandToggleClick}
          columnWidths={columnWidths}
        />
        {isExpanded ? (
          <TreeChildren
            childrenData={childrenData}
            columns={columns}
            columnWidths={columnWidths}
            getChildrenData={getChildrenData}
            isExpanded={isExpanded}
            depth={depth}
          />
        ) : null}
      </div>
    );
  }
}
