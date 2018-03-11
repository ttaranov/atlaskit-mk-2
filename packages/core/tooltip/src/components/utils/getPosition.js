// @flow

import inViewport from './inViewport';

import type { CoordinatesType, PositionType } from '../../types';

type Coords = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};
type GetCoordsResults = {
  top: Coords,
  right: Coords,
  bottom: Coords,
  left: Coords,
};
type GetCoordsArgs = {
  targetRect: ClientRect,
  tooltipRect: ClientRect,
  gutter: number,
};
type GetPositionArgs = {
  position: PositionType,
  target: HTMLElement,
  tooltip: HTMLElement,
};
type GetPositionResults = {
  coordinates?: CoordinatesType,
  position: PositionType,
};

const FLIPPED_POSITION = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

function getCoords({
  targetRect,
  tooltipRect,
  gutter,
}: GetCoordsArgs): GetCoordsResults {
  return {
    top: {
      top: targetRect.top - (tooltipRect.height + gutter),
      right: 0,
      bottom: 0,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    },
    right: {
      top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
      right: targetRect.right + gutter + tooltipRect.width, // used to calculate flip
      bottom: 0,
      left: targetRect.right + gutter,
    },
    bottom: {
      top: targetRect.bottom + gutter,
      right: 0,
      bottom: targetRect.bottom + gutter + tooltipRect.height, // used to calculate flip
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    },
    left: {
      top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
      right: 0,
      bottom: 0,
      left: targetRect.left - (tooltipRect.width + gutter),
    },
  };
}

export default function getPosition({
  position,
  target,
  tooltip,
}: GetPositionArgs): GetPositionResults {
  const noPosition = {
    coordinates: { left: 0, top: 0 },
    position: 'bottom',
  };

  /* eslint-disable no-console */
  if (!position) console.error('Property "position" is required.');
  if (!target) console.error('Property "target" is required.');
  if (!tooltip) console.error('Property "tooltip" is required.');
  if (!position || !target || !tooltip) return noPosition;
  /* eslint-enable no-console */

  // get the original coordinates
  const gutter = 8;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  const POSITIONS = getCoords({ targetRect, tooltipRect, gutter });

  // set tooltip positions before viewport check
  const attemptedPosition = POSITIONS[position];

  // check if the tooltip is in view or must be flipped
  const adjustedPosition = inViewport(attemptedPosition)
    ? position
    : FLIPPED_POSITION[position];

  // adjust positions with (possibly) flipped position
  const left = POSITIONS[adjustedPosition].left;
  const top = POSITIONS[adjustedPosition].top;

  return {
    coordinates: { left, top },
    position: adjustedPosition,
  };
}
