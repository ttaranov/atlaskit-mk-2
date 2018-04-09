// @flow

import inViewport from './inViewport';

import type {
  CoordinatesType,
  PositionType,
  PositionTypeBase,
} from '../../types';

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
  mouseCoordinates: CoordinatesType | null,
  mousePosition: PositionTypeBase,
};
type getMouseCoordsArgs = {
  mouseCoordinates: CoordinatesType,
  tooltipRect: ClientRect,
  gutter: number,
};
type GetPositionResults = {
  coordinates: CoordinatesType,
  position: PositionType,
  mousePosition: PositionTypeBase,
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

function getMouseCoords({
  mouseCoordinates,
  tooltipRect,
  gutter,
}: getMouseCoordsArgs) {
  const cursorPaddingRight = 8;
  const cursorPaddingBottom = 12;
  return {
    top: {
      top: mouseCoordinates.top - (tooltipRect.height + gutter),
      right: 0,
      bottom: 0,
      left: mouseCoordinates.left - tooltipRect.width / 2,
    },
    right: {
      top: mouseCoordinates.top + (0 - tooltipRect.height) / 2,
      right:
        mouseCoordinates.left + cursorPaddingRight + gutter + tooltipRect.width, // used to calculate flip
      bottom: 0,
      left: mouseCoordinates.left + cursorPaddingRight + gutter,
    },
    bottom: {
      top: mouseCoordinates.top + cursorPaddingBottom + gutter,
      right: 0,
      bottom:
        mouseCoordinates.top +
        cursorPaddingBottom +
        gutter +
        tooltipRect.height, // used to calculate flip
      left: mouseCoordinates.left - tooltipRect.width / 2,
    },
    left: {
      top: mouseCoordinates.top - tooltipRect.height / 2,
      right: 0,
      bottom: 0,
      left: mouseCoordinates.left - (tooltipRect.width + gutter),
    },
  };
}

function getMousePosition({ mousePosition, tooltip, mouseCoordinates }) {
  const noPosition = {
    coordinates: { left: 0, top: 0 },
    position: 'mouse',
    mousePosition: 'bottom',
  };

  if (!mousePosition) throw new Error('Property "mousePosition" is required.');
  if (!tooltip) throw new Error('Property "tooltip" is required.');

  if (!mouseCoordinates) return noPosition;

  // get the original coordinates
  const gutter = 8;
  const tooltipRect = tooltip.getBoundingClientRect();

  const POSITIONS = getMouseCoords({ mouseCoordinates, tooltipRect, gutter });

  // set tooltip positions before viewport check
  const attemptedPosition = POSITIONS[mousePosition];

  // check if the tooltip is in view or must be flipped
  const adjustedPosition = inViewport(attemptedPosition)
    ? mousePosition
    : FLIPPED_POSITION[mousePosition];

  // adjust positions with (possibly) flipped position
  const left = POSITIONS[adjustedPosition].left;
  const top = POSITIONS[adjustedPosition].top;

  return {
    coordinates: { left, top },
    position: 'mouse',
    mousePosition: adjustedPosition,
  };
}

export default function getPosition({
  position,
  target,
  tooltip,
  mouseCoordinates,
  mousePosition,
}: GetPositionArgs): GetPositionResults {
  if (position === 'mouse') {
    return getMousePosition({ mousePosition, tooltip, mouseCoordinates });
  }

  const noPosition = {
    coordinates: { left: 0, top: 0 },
    position: 'bottom',
    mousePosition,
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
    mousePosition,
  };
}
