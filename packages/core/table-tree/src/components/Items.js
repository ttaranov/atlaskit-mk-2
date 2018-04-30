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
  depth?: number,
  getItemsData: ItemsProvider,
  items: Array<Object>,
  parentData?: Object,
  render: RenderFunction,
};

type State = {
  childItems?: ItemsDataType,
  isLoaderShown: boolean,
  items: Array<Object>,
};

export default class Items extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  state: State = {
    isLoaderShown: true,
    items: this.props.items,
  };

  loadCancelled = false;

  componentWillReceiveProps(props: Props) {
    this.setState({
      items: props.items,
    });
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
    const { items } = this.state;
    return (
      <LoaderItem
        isCompleting={!!items}
        onComplete={this.handleLoaderComplete}
        depth={depth + 1}
      />
    );
  }

  renderItem = (itemData: Object, index: number) => {
    const { getItemsData, render, depth = 0 } = this.props;
    return (
      <Item
        data={itemData}
        getChildrenData={getItemsData}
        depth={depth + 1}
        key={(itemData && itemData.id) || index}
        render={render}
      />
    );
  };

  loadChildren = (parentData: Object) => {
    Promise.resolve()
      .then(() => this.props.getItemsData(parentData))
      .then(itemsData => {
        if (!this.loadCancelled) {
          this.setState({
            childItems: itemsData,
          });
        }
      });
  };

  renderItems() {
    const { parentData } = this.props;
    if (parentData) {
      this.loadChildren(parentData);
      return (
        this.state.childItems && this.state.childItems.map(this.renderItem)
      );
    }
    return this.state.items && this.state.items.map(this.renderItem);
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
