// @flow

import React, { PureComponent } from 'react';

import InteractionStateManager from '../InteractionStateManager';
import type { InteractionState } from '../InteractionStateManager/types';
import { styleReducerNoOp } from '../../theme';
import ItemPrimitive from './primitives';
import type { ItemProps } from './types';

export default class Item extends PureComponent<ItemProps> {
  static defaultProps = {
    styles: styleReducerNoOp,
    isSelected: false,
    spacing: 'default',
    text: '',
  };

  renderItem = (state: InteractionState) => (
    <ItemPrimitive {...state} {...this.props} />
  );

  render() {
    return (
      <InteractionStateManager {...this.props}>
        {this.renderItem}
      </InteractionStateManager>
    );
  }
}
