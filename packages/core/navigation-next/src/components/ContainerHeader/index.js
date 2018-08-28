// @flow

import React, { PureComponent } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import Item from '../Item';
import { styleReducerNoOp } from '../../theme';
import type { ContainerHeaderProps } from './types';

const gridSize = gridSizeFn();

const modifyStyles = defaultStyles => ({
  ...defaultStyles,
  itemBase: {
    ...defaultStyles.itemBase,
    height: `${gridSize * 7}px`,
    paddingLeft: gridSize / 2,
    paddingRight: gridSize / 2,
  },
  beforeWrapper: {
    ...defaultStyles.beforeWrapper,
    marginRight: gridSize * 1.5,
  },
  afterWrapper: {
    ...defaultStyles.afterWrapper,
    marginLeft: gridSize,
  },
});

export default class ContainerHeader extends PureComponent<
  ContainerHeaderProps,
> {
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
