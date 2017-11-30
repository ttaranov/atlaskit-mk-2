// @flow
import React, { PureComponent } from 'react';

import RowChildren from './RowChildren';
import { type DataFunction } from './../types';

type Props = {
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
    const newIsExpanded = !this.state.isExpanded;
    if (newIsExpanded) {
      Promise.resolve()
        .then(() => this.props.getChildrenData(this.props.data))
        .then(childrenData => {
          this.setState({
            childrenData,
            isExpanded: newIsExpanded,
          });
        });
    } else {
      this.setState({
        isExpanded: newIsExpanded,
      });
    }
  }

  renderRowChildren() {
    const { getChildrenData, depth, render } = this.props;
    const { isExpanded, childrenData } = this.state;
    return (
      isExpanded && (
        <RowChildren
          childrenData={childrenData}
          getChildrenData={getChildrenData}
          isExpanded={isExpanded}
          depth={depth}
          render={render}
        />
      )
    );
  }

  render() {
    const { depth, data, render } = this.props;

    const rowProps = {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
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
