// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';
import { Draggable } from 'react-beautiful-dnd';

import Item from '../Item';
import type { SortableItemProps } from './types';

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
}: any) => <div ref={innerRef} {...props} />;

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
          {...itemProps}
          onClick={onClick}
          component={Div}
        />
      );
    }}
  </Draggable>
);

export default SortableItem;
