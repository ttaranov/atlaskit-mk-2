// @flow
import React, { PureComponent } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import {
  type ItemsProvider,
  type RenderFunction,
  type ItemsDataType,
} from './../types';

type Props = {
  parentData?: Object,
  getItemsData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isLoaderShown: boolean,
  itemsData?: ItemsDataType,
};

export default class Items extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  state: State = {
    isLoaderShown: false,
  };

  loadCancelled = false;

  componentWillMount() {
    if (this.state.itemsData) {
      return;
    }
    const itemsResult = this.props.getItemsData(this.props.parentData);
    if (itemsResult && typeof itemsResult.then === 'function') {
      this.setState({
        isLoaderShown: true,
      });
      this.loadCancelled = false;
      itemsResult.then(itemsData => {
        if (this.loadCancelled) {
          return;
        }
        this.setState({
          itemsData,
        });
      });
    } else {
      this.setState({
        itemsData: itemsResult,
      });
    }
  }

  componentWillUnmount() {
    this.loadCancelled = true;
  }

  handleLoaderComplete = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth } = this.props;
    const { itemsData } = this.state;
    return (
      <LoaderItem
        isCompleting={!!itemsData}
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
