// @flow
import React, { PureComponent } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import {
  type ItemsProvider,
  type RenderFunction,
  type ItemsDataType,
  type ItemsRenderedFunction,
} from './../types';

type Props = {
  parentData?: Object,
  getItemsData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
  onItemsRendered?: ItemsRenderedFunction,
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
    const { parentData } = this.props;
    if (!this.state.itemsData) {
      this.setState({
        isLoaderShown: true,
      });
      this.loadCancelled = false;
      Promise.resolve()
        .then(() => this.props.getItemsData(parentData))
        .then(itemsData => {
          if (!this.loadCancelled) {
            this.setState(
              {
                itemsData,
              },
              () => {
                if (this.props.onItemsRendered) {
                  this.props.onItemsRendered(parentData, itemsData);
                }
              },
            );
          }
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
    const { getItemsData, render, depth = 0, onItemsRendered } = this.props;
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
          onItemsRendered={onItemsRendered}
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
