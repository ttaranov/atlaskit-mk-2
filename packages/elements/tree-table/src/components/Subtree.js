// @flow
import React, { PureComponent } from 'react';
import RowChildren from './RowChildren';
import { type DataFunction } from './../types';

import Loader from './Loader';

type Props = {
  data: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render: Function,
};

export default class Subtree extends PureComponent<Props> {
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
    this.handleLoadingFinished = this.handleLoadingFinished.bind(this);
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

  handleLoadingFinished() {
    this.setState({
      isLoading: false,
    });
  }

  renderLoading() {
    const isCompleting = !!this.state.childrenData;
    return (
      <Loader
        isCompleting={isCompleting}
        onComplete={this.handleLoadingFinished}
        depth={this.props.depth}
      />
    );
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
    const { isLoading } = this.state;

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
        {isLoading ? this.renderLoading() : this.renderRowChildren()}
      </div>
    );
  }
}
