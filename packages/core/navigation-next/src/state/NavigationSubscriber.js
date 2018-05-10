// @flow

import React, { Component } from 'react';
import { Subscribe } from 'unstated';

import NavigationState from './NavigationState';
import type {
  NavigationStateSelector,
  NavigationSubscriberProps,
} from './types';

const onNoop: NavigationStateSelector = state => state;

export default class NavigationSubscriber extends Component<
  NavigationSubscriberProps,
> {
  static defaultProps = {
    on: onNoop,
  };

  cachedChildrenNode = null;
  cachedSelectedState = null;

  render() {
    const { children, on: selector } = this.props;

    return (
      <Subscribe to={[NavigationState]}>
        {navigation => {
          const selectedState = selector(navigation.state);

          if (selectedState !== this.cachedSelectedState) {
            // We still pass children the entire navigation container (rather
            // than just the slice of state that they selected) because they
            // need to access methods etc. NOTE: If the children function uses a
            // part of state which they're not selecting, it won't update.
            const childrenNode = children(navigation);

            this.cachedChildrenNode = childrenNode;
            this.cachedSelectedState = selectedState;
            return childrenNode;
          }

          return this.cachedChildrenNode || children(navigation);
        }}
      </Subscribe>
    );
  }
}
