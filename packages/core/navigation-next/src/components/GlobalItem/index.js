// @flow

import React, { PureComponent } from 'react';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

export default class GlobalItem extends PureComponent<GlobalItemProps> {
  static defaultProps = {
    size: 'large',
    styles: styleReducerNoOp,
  };
  renderItem = (state: *) => <GlobalItemPrimitive {...state} {...this.props} />;

  render() {
    return <InteractionStateManager>{this.renderItem}</InteractionStateManager>;
  }
}

export type { GlobalItemProps } from './types';
