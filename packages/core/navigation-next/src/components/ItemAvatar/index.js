// @flow

import React, { Component } from 'react';
import Avatar from '@atlaskit/avatar';

import { styleReducerNoOp, withContentTheme } from '../../theme';
import type { ItemAvatarPrimitiveProps } from './types';

class ItemAvatar extends Component<ItemAvatarPrimitiveProps> {
  static defaultProps = {
    styles: styleReducerNoOp,
  };

  render() {
    const { itemState, styles: styleReducer, theme, ...props } = this.props;
    const { mode, context } = theme;
    const borderColor = styleReducer(mode.item(itemState)[context], itemState)
      .itemBase.backgroundColor;

    return <Avatar borderColor={borderColor} {...props} />;
  }
}

export default withContentTheme(ItemAvatar);
