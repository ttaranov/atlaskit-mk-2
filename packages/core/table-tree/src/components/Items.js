// @flow
import React, { PureComponent } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import {
  type ItemsProvider,
  type RenderFunction,
  type LoadableItems,
} from './../types';

type Props = {
  parentData?: Object,
  // getItemsData: ItemsProvider,
  items: LoadableItems,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isLoaderShown: boolean,
  // itemsData: LoadableItems,
};

export default class Items extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  state: State = {
    isLoaderShown: false,
  };

  // loadCancelled = false;

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!nextProps.items && !prevState.isLoaderShown) {
      return {
        isLoaderShown: true,
      };
    }
    return null;
  }
  // TODO remove if we don't need a provider function API
  //
  // componentWillMount() {
  //   if (!this.state.itemsData) {
  //     this.setState({
  //       isLoaderShown: true,
  //     });
  //     this.loadCancelled = false;
  //     Promise.resolve()
  //       .then(() => this.props.getItemsData(this.props.parentData))
  //       .then(itemsData => {
  //         if (!this.loadCancelled) {
  //           this.setState({
  //             itemsData,
  //           });
  //         }
  //       });
  //   }
  // }
  //
  // componentWillUnmount() {
  //   this.loadCancelled = true;
  // }

  handleLoaderComplete = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth, items } = this.props;
    return (
      <LoaderItem
        isCompleting={!!items}
        onComplete={this.handleLoaderComplete}
        depth={depth + 1}
      />
    );
  }

  renderItems() {
    const { render, items, depth = 0 } = this.props;
    return (
      items &&
      items.map((itemData: Object, index: number) => (
        <Item
          data={itemData}
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
