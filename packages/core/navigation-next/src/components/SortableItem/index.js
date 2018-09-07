// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import type { ItemProps } from '../Item';
import { Item } from '../../';

export default function({
  draggableProps: { innerRef, ...draggableProps },
  ...props
}: ItemProps) {
  return (
    <div ref={innerRef} {...draggableProps}>
      <Item
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
    </div>
  );
}
