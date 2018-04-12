// @flow

import React, { Component } from 'react';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

export default class GlobalItem extends Component<GlobalItemProps> {
  static defaultProps = {
    isFirst: false,
    size: 'large',
    styles: styleReducerNoOp,
  };

  render() {
    return (
      <InteractionStateManager>
        {state => <GlobalItemPrimitive {...state} {...this.props} />}
      </InteractionStateManager>
    );
  }
}
