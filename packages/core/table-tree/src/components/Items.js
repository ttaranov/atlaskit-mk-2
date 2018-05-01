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
  // flowlint-next-line unclear-type:off
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
    if (!this.state.itemsData) {
      this.setState({
        isLoaderShown: true,
      });
      this.loadCancelled = false;
      Promise.resolve()
        .then(() => this.props.getItemsData(this.props.parentData))
        .then(itemsData => {
          if (!this.loadCancelled) {
            this.setState({
              itemsData,
            });
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
    const { getItemsData, render, depth = 0 } = this.props;
    const { itemsData } = this.state;
    return (
      itemsData &&
      // flowlint-next-line unclear-type:off
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
    const busyAttrs = isLoaderShown
      ? { 'aria-busy': true, 'aria-live': 'polite' }
      : {};
    return (
      <div role={'rowgroup'} {...busyAttrs}>
        {isLoaderShown ? this.renderLoader() : this.renderItems()}
      </div>
    );
  }
}
