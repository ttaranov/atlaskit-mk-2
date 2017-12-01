// @flow
import React, { PureComponent } from 'react';

import RowChildren from './RowChildren';
import { type DataFunction } from './../types';

type Props = {
  data: Object,
  getChildrenData: DataFunction,
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
          isExpanded={isExpanded}
          depth={depth}
          getChildrenData={getChildrenData}
          render={render}
        />
      )
    );
  }

  render() {
    const { depth, data, render } = this.props;

    let rowData = render(data);
    if (!rowData) {
      return null;
    }
    rowData = React.cloneElement(rowData, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      data,
      isExpanded: this.state.isExpanded,
    });
    const key = rowData.props.key;
    return (
      <div key={key}>
        {rowData}
        {this.renderRowChildren()}
      </div>
    );
  }
}
