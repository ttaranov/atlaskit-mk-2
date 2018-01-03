// @flow
import React, { PureComponent } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import { type ItemsProvider, type RenderFunction } from './../types';

type ItemsDataType = Array<Object>;

type Props = {
  childrenData: ?ItemsDataType,
  getChildrenData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isLoaderShown?: boolean,
};

export default class Items extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  componentWillMount() {
    this.setState({
      isLoaderShown: Items.isLoadingData(this.props.childrenData),
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.childrenData !== this.props && this.props.childrenData) {
      if (Items.isLoadingData(nextProps.childrenData)) {
        this.setState({ isLoaderShown: true });
      }
    }
  }

  static isLoadingData(data: ?ItemsDataType) {
    return !data;
  }

  handleLoadingFinished = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth, childrenData } = this.props;
    const isCompleting = !Items.isLoadingData(childrenData);
    return (
      <LoaderItem
        isCompleting={isCompleting}
        onComplete={this.handleLoadingFinished}
        depth={depth + 1}
      />
    );
  }

  renderChildItems() {
    const { childrenData, getChildrenData, render, depth = 0 } = this.props;
    return (
      childrenData &&
      childrenData.map((childRowData: Object, index: number) => (
        <Item
          data={childRowData}
          getChildrenData={getChildrenData}
          depth={depth + 1}
          key={(childRowData && childRowData.id) || index}
          render={render}
        />
      ))
    );
  }

  render() {
    const { isLoaderShown } = this.state;
    return (
      <div>{isLoaderShown ? this.renderLoader() : this.renderChildItems()}</div>
    );
  }
}
