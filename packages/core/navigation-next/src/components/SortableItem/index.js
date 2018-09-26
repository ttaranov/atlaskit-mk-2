// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import type { ItemProps } from '../Item';
import { Item } from '../../';

// The sortable item cannot be a `<button />` because rbdnd will use it as a
// placeholder and we have no way of removing the browser's default button
// styling.
// NOTE that we strip off any props that would result in invalid DOM attributes
const ItemComponent = ({
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

export default function(props: ItemProps) {
  return (
    <Item
      component={ItemComponent}
      styles={(styles, { isDragging }, theme) => {
        let bg = styles.itemBase.backgroundColor;
        if (theme.context === 'container') {
          if (isDragging) bg = colors.N30;
        }
        if (theme.context === 'product') {
          if (isDragging) bg = colors.DN30;
        }

        return {
          ...styles,
          itemBase: {
            ...styles.itemBase,
            backgroundColor: bg,
            boxShadow: isDragging
              ? `${colors.N60A} 0px 4px 8px -2px, ${colors.N60A} 0px 0px 1px`
              : null,
            cursor: isDragging ? 'grabbing' : 'pointer',
            pointerEvents: 'all !important',
          },
        };
      }}
      {...props}
    />
  );
}
