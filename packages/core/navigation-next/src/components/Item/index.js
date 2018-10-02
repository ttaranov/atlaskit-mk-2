// @flow

import React, { PureComponent } from 'react';

import { navigationItemClicked } from '../../common/analytics';
import InteractionStateManager from '../InteractionStateManager';
import type { InteractionState } from '../InteractionStateManager/types';
import { styleReducerNoOp } from '../../theme';
import ItemPrimitive from './primitives';
import type { ConnectedItemProps } from './types';

export class ConnectedItem extends PureComponent<ConnectedItemProps> {
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

export default navigationItemClicked(ConnectedItem, 'item');
