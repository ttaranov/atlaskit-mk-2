// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import type { ItemProps } from '../Item/types';
import { Item } from '../../';

// The sortable item cannot be a `<button />` because rbdnd will use it as a
// placeholder and we have no way of removing the browser's default button
// styling.
// NOTE that we strip off any props that would result in invalid DOM attributes
const Div = ({
  after,
  before,
  component,
  createAnalyticsEvent,
  draggableProps,
  index,
  innerRef,
  isActive,
  isDragging,
  isHover,
  isSelected,
  spacing,
  styles,
  subText,
  ...props
}: *) => <div ref={innerRef} {...props} />;

const getStyles = (provided, { isDragging }, theme) => {
  let bg = provided.itemBase.backgroundColor;
  if (theme.context === 'container') {
    if (isDragging) bg = colors.N30;
  }
  if (theme.context === 'product') {
    if (isDragging) bg = colors.DN30;
  }

  return {
    ...provided,
    itemBase: {
      ...provided.itemBase,
      backgroundColor: bg,
      boxShadow: isDragging
        ? `${colors.N60A} 0px 4px 8px -2px, ${colors.N60A} 0px 0px 1px`
        : null,
      cursor: isDragging ? 'grabbing' : 'pointer',
      pointerEvents: 'all !important',
    },
  };
};

const SortableItem = (props: ItemProps) => (
  <Item component={Div} styles={getStyles} {...props} />
);

export default SortableItem;
