// @flow
import React, { PureComponent } from 'react';
import Subtree from './Subtree';
import Loader from './Loader';
import { type DataFunction } from './../types';

type Props = {
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
  // isLoading?: boolean,
};

export default class RowChildren extends PureComponent<Props> {
  state = {
    isLoaderShown: this.isLoadingData(this.props && this.props.childrenData),
  };

  constructor() {
    super();
    this.handleLoadingFinished = this.handleLoadingFinished.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.childrenData !== this.props.childrenData) {
      if (this.isLoadingData(nextProps.childrenData)) {
        this.setState({ isLoaderShown: true });
      }
    }
  }

  isLoadingData(data) {
    return !data;
  }

  handleLoadingFinished() {
    this.setState({
      isLoaderShown: false,
    });
  }

  renderLoader() {
    const isCompleting = !this.isLoadingData(this.props.childrenData);
    return (
      <Loader
        isCompleting={isCompleting}
        onComplete={this.handleLoadingFinished}
        depth={this.props.depth}
      />
    );
  }

  renderChildRows() {
    const {
      childrenData = [],
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return childrenData.map((childRowData, index) => (
      <Subtree
        data={childRowData}
        getChildrenData={getChildrenData}
        depth={depth + 1}
        key={childRowData.id || index}
        render={render}
      />
    ));
  }

  render() {
    const { isLoaderShown } = this.state;
    return (
      <div>{isLoaderShown ? this.renderLoader() : this.renderChildRows()}</div>
    );
  }
}
