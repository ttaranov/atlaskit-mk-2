// @flow

import inViewport from './inViewport';

import type { PlacementType, PositionType } from '../../types';

type GetPositionArguments = {
  placement: PlacementType,
  target: HTMLElement,
  tooltip: HTMLElement,
};

type PositionResult = {
  placement?: PlacementType,
  position: PositionType,
  isFlipped?: boolean,
};

const FLIPPED_PLACEMENT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export default function getPosition({ placement, target, tooltip }: GetPositionArguments): PositionResult {
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
      right: targetRect.right + gutter + tooltipRect.width, // used to calculate flip
      bottom: 0,
      left: targetRect.right + gutter,
    },
    bottom: {
      top: targetRect.bottom + gutter,
      right: 0,
      bottom: targetRect.bottom + gutter + tooltipRect.height, // used to calculate flip
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
  const attemptedPosition = PLACEMENT_POSITIONS[placement];

  // check if the tooltip is in view or must be flipped
  const adjustedPlacement = inViewport(attemptedPosition)
    ? placement
    : FLIPPED_PLACEMENT[placement];

  // adjust positions with (possibly) flipped placement
  const left = PLACEMENT_POSITIONS[adjustedPlacement].left;
  const top = PLACEMENT_POSITIONS[adjustedPlacement].top;

  return {
    placement: adjustedPlacement,
    position: { left, top },
  };
}
