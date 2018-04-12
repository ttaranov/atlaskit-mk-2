// @flow

import React, { Component } from 'react';
import { gridSize } from '@atlaskit/theme';

import Item from '../Item';
import type { ItemProps } from '../Item/types';
import { styleReducerNoOp } from '../../theme';
import type { StyleReducer } from '../../theme/types';

const modifyStyles: StyleReducer<*> = defaultStyles => ({
  ...defaultStyles,
  itemBase: {
    ...defaultStyles.itemBase,
    height: `${gridSize() * 7}px`,
    paddingLeft: gridSize() / 2,
    paddingRight: gridSize() / 2,
  },
  beforeWrapper: {
    ...defaultStyles.beforeWrapper,
    marginRight: gridSize(),
  },
  afterWrapper: {
    ...defaultStyles.afterWrapper,
    marginLeft: gridSize(),
  },
});

// ContainerHeader passes most of its props through to an underlying Item. There
// are a couple of props which it doesn't use.
type ExcludedProps = {
  spacing: *, // ContainerHeader doesn't have spacing options
};
type Props = $Diff<ItemProps, ExcludedProps>;

export default class ContainerHeader extends Component<Props> {
  static defaultProps = {
    styles: styleReducerNoOp,
    isSelected: false,
    text: '',
  };

  render() {
    const { styles: styleReducer, ...props } = this.props;

    // We modify the Item styles ourselves, then allow the consumer to modify
    // these if they want to.
    const patchedStyles = (defaultStyles, state) =>
      styleReducer(modifyStyles(defaultStyles), state);

    return <Item {...props} styles={patchedStyles} spacing="default" />;
  }
}
