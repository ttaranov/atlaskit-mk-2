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
  isExpanded?: boolean,
  depth?: number,
  render?: Function,
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

  renderChildren() {
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
        <TreeChildren
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

  renderFromProps() {
    const {
      data,
      columns,
      hasChildren,
      depth,
      columnWidths,
      isExpanded,
    } = this.props;
    if (!data) {
      return null;
    }
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
        {this.renderChildren()}
      </div>
    );
  }

  renderFromChildren() {
    return <div>{this.props.children}</div>;
  }

  renderFromRenderProp() {
    if (!this.props.render) {
      return null;
    }
    const { hasChildren, depth, columnWidths } = this.props;
    const row = this.props.render(this.props.data.content);
    const wrappedRow = React.cloneElement(row, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      hasChildren,
      columnWidths,
      isExpanded: this.state.isExpanded,
    });
    return (
      <div>
        {wrappedRow}
        {this.renderChildren()}
      </div>
    );
  }

  render() {
    return (
      this.renderFromRenderProp() ||
      this.renderFromProps() ||
      this.renderFromChildren()
    );
  }
}
