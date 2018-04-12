// @flow

import React, { Component } from 'react';
import Avatar from '@atlaskit/avatar';

import type { PresentationProps } from '../Item/types';
import { light, styleReducerNoOp, withTheme } from '../../theme';
import type { StyleReducer, Theme } from '../../theme/types';

type Props = {
  itemState: PresentationProps,
  /** Note: This function will be provided with the styles for an Item, because
   * ItemAvatar inherits its border color from Item's background color.  */
  styles: StyleReducer<PresentationProps>,
  theme: Theme,
};

class ItemAvatar extends Component<Props> {
  static defaultProps = {
    styles: styleReducerNoOp,
    theme: { mode: light, context: 'container' },
  };

  render() {
    const { itemState, styles: styleReducer, theme, ...props } = this.props;
    const { mode, context } = theme;
    const borderColor = styleReducer(mode.item(itemState)[context], itemState)
      .itemBase.backgroundColor;

    return <Avatar borderColor={borderColor} {...props} />;
  }
}

export default withTheme(ItemAvatar);
