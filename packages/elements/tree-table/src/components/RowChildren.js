// @flow
import React, { PureComponent } from 'react';
import Row from './Row';
import LoaderRow from './LoaderRow';
import { type DataFunction, type RenderFunction } from './../types';

type Props = {
  childrenData: Array<Object | null> | null,
  getChildrenData: DataFunction,
  depth?: number,
  render?: RenderFunction,
};

type State = {
  isLoaderShown?: boolean,
};

export default class RowChildren extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  constructor() {
    super();
    this.handleLoadingFinished = this.handleLoadingFinished.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoaderShown: RowChildren.isLoadingData(this.props.childrenData),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.childrenData !== this.props && this.props.childrenData) {
      if (RowChildren.isLoadingData(nextProps.childrenData)) {
        this.setState({ isLoaderShown: true });
      }
    }
  }

  static isLoadingData(data) {
    return !data;
  }

  handleLoadingFinished() {
    this.setState({
      isLoaderShown: false,
    });
  }

  renderLoader() {
    const { depth, childrenData } = this.props;
    const isCompleting = !RowChildren.isLoadingData(childrenData);
    return (
      <LoaderRow
        isCompleting={isCompleting}
        onComplete={this.handleLoadingFinished}
        depth={depth + 1}
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
      <Row
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
