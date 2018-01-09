// @flow
import React, { PureComponent } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import { type ItemsProvider, type RenderFunction } from './../types';

type ItemsDataType = Array<Object>;

type Props = {
  parentData?: Object,
  getItemsData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isLoaderShown: boolean,
  itemsData: ?ItemsDataType,
};

export default class Items extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  state = {
    isLoaderShown: false,
    itemsData: null,
  };

  cancelPendingLoad = () => {};

  componentDidMount() {
    if (!Items.isDataReady(this.state.itemsData)) {
      this.cancelPendingLoad();
      this.cancelPendingLoad = this.load();
    }
  }

  componentWillUnmount() {
    this.cancelPendingLoad();
  }

  load() {
    this.setState({
      isLoaderShown: true,
    });
    let cancelled = false;
    Promise.resolve()
      .then(() => this.props.getItemsData(this.props.parentData))
      .then(itemsData => {
        if (!cancelled) {
          this.setState({
            itemsData,
          });
        }
      });
    return function cancel() {
      cancelled = true;
    };
  }

  static isDataReady(data: ?ItemsDataType): boolean {
    return !!data;
  }

  handleLoaderComplete = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth } = this.props;
    const { itemsData } = this.state;
    const isCompleting = Items.isDataReady(itemsData);
    return (
      <LoaderItem
        isCompleting={isCompleting}
        onComplete={this.handleLoaderComplete}
        depth={depth + 1}
      />
    );
  }

  renderItems() {
    const { getItemsData, render, depth = 0 } = this.props;
    const { itemsData } = this.state;
    return (
      itemsData &&
      itemsData.map((itemData: Object, index: number) => (
        <Item
          data={itemData}
          getChildrenData={getItemsData}
          depth={depth + 1}
          key={(itemData && itemData.id) || index}
          render={render}
        />
      ))
    );
  }

  render() {
    const { isLoaderShown } = this.state;
    return (
      <div>{isLoaderShown ? this.renderLoader() : this.renderItems()}</div>
    );
  }
}
