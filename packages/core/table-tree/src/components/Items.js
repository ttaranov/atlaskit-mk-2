// @flow
import React, { Component } from 'react';
import Item from './Item';
import LoaderItem from './LoaderItem';
import { type RenderFunction, type LoadableItems } from './../types';

type Props = {
  parentData?: Object,
  items: LoadableItems,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isLoaderShown: boolean,
};

export default class Items extends Component<Props, State> {
  static defaultProps = {
    depth: 0,
  };

  state: State = {
    isLoaderShown: false,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!nextProps.items && !prevState.isLoaderShown) {
      return {
        isLoaderShown: true,
      };
    }
    return null;
  }

  handleLoaderComplete = () => {
    this.setState({
      isLoaderShown: false,
    });
  };

  renderLoader() {
    const { depth, items } = this.props;
    return (
      <LoaderItem
        isCompleting={!!(items && items.length)}
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
