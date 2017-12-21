// @flow
import React, { PureComponent } from 'react';
import RowChildren from './RowChildren';
import { type DataFunction, type RenderFunction } from './../types';

type Props = {
  data: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isExpanded: boolean,
  childrenData?: Array<Object>,
};

export default class Row extends PureComponent<Props, State> {
  state: State = {
    isExpanded: false,
  };

  static defaultProps = {
    depth: 0,
  };

  handleExpandToggleClick = () => {
    const newIsExpanded = !this.state.isExpanded;
    if (newIsExpanded && !this.state.childrenData) {
      Promise.resolve()
        .then(() => this.props.getChildrenData(this.props.data))
        .then(childrenData => {
          this.setState({
            childrenData,
          });
        });
    }
    this.setState({
      isExpanded: newIsExpanded,
    });
  };

  render() {
    const { depth, data, render, getChildrenData } = this.props;
    const { isExpanded, childrenData } = this.state;

    let rowData = render(data);
    if (!rowData) {
      return null;
    }
    rowData = React.cloneElement(rowData, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      isExpanded,
    });
    return (
      <div>
        {rowData}
        {isExpanded && (
          <RowChildren
            childrenData={childrenData}
            depth={depth}
            getChildrenData={getChildrenData}
            render={render}
          />
        )}
      </div>
    );
  }
}
