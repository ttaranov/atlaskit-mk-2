// @flow

import React, { PureComponent } from 'react';

import { navigationItemClicked } from '../../common/analytics';
import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

class GlobalItem extends PureComponent<GlobalItemProps> {
  static defaultProps = {
    label: '',
    size: 'large',
    styles: styleReducerNoOp,
  };
  renderItem = (state: *) => <GlobalItemPrimitive {...state} {...this.props} />;

  render() {
    return <InteractionStateManager>{this.renderItem}</InteractionStateManager>;
  }
}

export default navigationItemClicked(GlobalItem, 'globalItem');

export type { GlobalItemProps } from './types';
