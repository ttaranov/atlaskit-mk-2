// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';
import { Draggable } from 'react-beautiful-dnd';

import Item from '../Item';
import type { SortableItemProps } from './types';

/* We use a DivWrapper item custom component to override the default Item DOM elements
 * as draggable button elements cause rbdnd to render a placeholder that is styled with
 * native button styling.
 *
 * If consumers pass a custom component themselves, they must spread the innerRef and
 * draggableProps properties onto their nearest DOM element.
 */
const DivWrapper = ({ className, children, draggableProps, innerRef }: any) => (
  <div className={className} ref={innerRef} {...draggableProps}>
    {children}
  </div>
);

const getStyles = (provided, { isDragging }) => {
  return {
    ...provided,
    itemBase: {
      ...provided.itemBase,
      boxShadow: isDragging
        ? `${colors.N60A} 0px 4px 8px -2px, ${colors.N60A} 0px 0px 1px`
        : null,
      cursor: isDragging ? 'grabbing' : 'pointer',
    },
  };
};

const SortableItem = ({ index, ...itemProps }: SortableItemProps) => (
  <Draggable
    draggableId={itemProps.id}
    index={index}
    disableInteractiveElementBlocking
  >
    {(draggableProvided, draggableSnapshot) => {
      const draggableProps = {
        ...draggableProvided.draggableProps,
        ...draggableProvided.dragHandleProps,
      };

      // disable onClick if the intention was drag
      const onClick = draggableSnapshot.isDragging
        ? undefined
        : itemProps.onClick;

      return (
        <Item
          draggableProps={draggableProps}
          innerRef={draggableProvided.innerRef}
          isDragging={draggableSnapshot.isDragging}
          styles={getStyles}
          component={DivWrapper}
          {...itemProps}
          onClick={onClick}
        />
      );
    }}
  </Draggable>
);

export default SortableItem;
