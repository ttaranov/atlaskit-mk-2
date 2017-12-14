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

type State = {
  isExpanded: boolean,
  isLoading: boolean,
  childrenData?: Array<Object>,
};

export default class Row extends PureComponent<Props, State> {
  state = {
    isExpanded: false,
    isLoading: false,
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
    if (newIsExpanded && !this.state.childrenData) {
      this.setState({
        isLoading: true,
      });
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
  }

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
      data,
      isExpanded,
    });
    const key = rowData.props.key;
    return (
      <div key={key}>
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
