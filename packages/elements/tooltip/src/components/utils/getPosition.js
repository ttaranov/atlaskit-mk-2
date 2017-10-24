// @flow

import inViewport from './inViewport';
import getScrollDistance from './getScrollDistance';

const FLIPPED_PLACEMENT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export default function getPosition({ placement, target, tooltip }) {
  const noPosition = { position: {}, isFlipped: false };

  /* eslint-disable no-console */
  if (!placement) console.error('Property "placement" is required.');
  if (!target) console.error('Property "target" is required.');
  if (!tooltip) console.error('Property "tooltip" is required.');
  if (!placement || !target || !tooltip) return noPosition;
  /* eslint-enable no-console */

  const gutter = 8;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  const PLACEMENT_POSITIONS = {
    top: {
      top: targetRect.top - (tooltipRect.height + gutter),
      right: 0,
      bottom: 0,
      left: targetRect.left + ((targetRect.width - tooltipRect.width) / 2),
    },
    right: {
      top: targetRect.top + ((targetRect.height - tooltipRect.height) / 2),
      right: targetRect.right + gutter + tooltipRect.width, // special case for right
      bottom: 0,
      left: targetRect.right + gutter,
    },
    bottom: {
      top: targetRect.bottom + gutter,
      right: 0,
      bottom: targetRect.bottom + gutter + tooltipRect.height, // special case for bottom
      left: targetRect.left + ((targetRect.width - tooltipRect.width) / 2),

    },
    left: {
      top: targetRect.top + ((targetRect.height - tooltipRect.height) / 2),
      right: 0,
      bottom: 0,
      left: targetRect.left - (tooltipRect.width + gutter),
    },
  };

  // set tooltip positions before scroll adjustment and viewport check
  const tooltipPosition = PLACEMENT_POSITIONS[placement];

  // check if the tooltip is in view or must be flipped
  const adjustedPlacement = inViewport(tooltipPosition)
    ? placement
    : FLIPPED_PLACEMENT[placement];

  // adjust positions with scroll distance
  const { scrollX, scrollY, isFixed } = getScrollDistance(target);
  const leftOffset = PLACEMENT_POSITIONS[adjustedPlacement].left;
  const topOffset = PLACEMENT_POSITIONS[adjustedPlacement].top;

  // account for fixed position ancestors
  const position = isFixed ? 'fixed' : 'absolute';
  const left = isFixed ? leftOffset : leftOffset + scrollX;
  const top = isFixed ? topOffset : topOffset + scrollY;

  return {
    placement: adjustedPlacement,
    position: { left, top, position },
  };
}
