// @flow

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

// Get viewport height excluding scrollbars
function getViewportHeight() {
  const docEl = document.documentElement;
  return (docEl && docEl.clientHeight) || window.innerHeight || 0;
}

// Get viewport width excluding scrollbars
function getViewportWidth() {
  const docEl = document.documentElement;
  return (docEl && docEl.clientWidth) || window.innerWidth || 0;
}

// Returns a top or left position that shifts the original coord to within viewport
function shiftCoord(coordName, coords, gutter) {
  const shiftedCoord = {};
  if (coordName === 'top' || coordName === 'left') {
    shiftedCoord[coordName] = 0 + gutter;
  }

  if (coordName === 'bottom') {
    const amountClipped = coords.bottom - getViewportHeight();
    const shiftedTop = coords.top - amountClipped - gutter;

    shiftedCoord.top = shiftedTop >= 0 ? shiftedTop : 0 + gutter;
  } else if (coordName === 'right') {
    const amountClipped = coords.right - getViewportWidth();
    const shiftedLeft = coords.left - amountClipped - gutter;

    shiftedCoord.left = shiftedLeft >= 0 ? shiftedLeft : 0 + gutter;
  }

  return shiftedCoord;
}

// Returns a map of positions to whether they fit in viewport
function getViewportBounds(
  { top, right, bottom, left }: Coords,
  gutter: number,
) {
  return {
    top: top >= 0 + gutter,
    left: left >= 0 + gutter,
    bottom: bottom <= getViewportHeight() - gutter,
    right: right <= getViewportWidth() - gutter,
  };
}

// Get the viewport bounds for each position coord
function getAllViewportBounds(allCoords: GetCoordsResults, gutter: number) {
  const viewportBounds = {};
  Object.keys(allCoords).forEach(position => {
    const coords = allCoords[position];

    viewportBounds[position] = getViewportBounds(coords, gutter);
  });

  return viewportBounds;
}

// Adjust the position and top/left coords to fit inside viewport
// Performs flipping on the primary axis and shifting on the secondary axis
function adjustPosition(originalPosition, positionCoords, gutter) {
  const flippedPosition = FLIPPED_POSITION[originalPosition];

  const viewportBounds = getAllViewportBounds(positionCoords, gutter);

  // Should flip if the original position was not within bounds and the new position is
  const shouldFlip =
    !viewportBounds[originalPosition][originalPosition] &&
    viewportBounds[flippedPosition][originalPosition];

  const adjustedPosition = shouldFlip ? flippedPosition : originalPosition;

  // Check secondary axis, for positional shift
  const shiftedCoords = {};
  const secondaryPositions = Object.keys(FLIPPED_POSITION).filter(
    position => position !== originalPosition && position !== flippedPosition,
  );

  secondaryPositions.forEach(position => {
    const inViewport = viewportBounds[adjustedPosition][position];
    if (!inViewport) {
      Object.assign(
        shiftedCoords,
        shiftCoord(position, positionCoords[adjustedPosition], gutter),
      );
    }
  });

  // adjust positions with flipped position on main axis + shifted position on secondary axis
  const left =
    shiftedCoords.left != null
      ? shiftedCoords.left
      : positionCoords[adjustedPosition].left;
  const top =
    shiftedCoords.top != null
      ? shiftedCoords.top
      : positionCoords[adjustedPosition].top;

  return { left, top, adjustedPosition };
}

function getCoords({
  targetRect,
  tooltipRect,
  gutter,
}: GetCoordsArgs): GetCoordsResults {
  return {
    top: {
      top: targetRect.top - (tooltipRect.height + gutter),
      right: targetRect.right - (targetRect.width - tooltipRect.width) / 2,
      bottom: targetRect.top - gutter,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    },
    right: {
      top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
      right: targetRect.right + gutter + tooltipRect.width,
      bottom: targetRect.bottom - (targetRect.height - tooltipRect.height) / 2,
      left: targetRect.right + gutter,
    },
    bottom: {
      top: targetRect.bottom + gutter,
      right: targetRect.right - (targetRect.width - tooltipRect.width) / 2,
      bottom: targetRect.bottom + gutter + tooltipRect.height,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    },
    left: {
      top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
      right: targetRect.left - gutter,
      bottom: targetRect.bottom - (targetRect.height - tooltipRect.height) / 2,
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
  const cursorPaddingBottom = 16;
  return {
    top: {
      top: mouseCoordinates.top - (tooltipRect.height + gutter),
      right: mouseCoordinates.left + tooltipRect.width / 2,
      bottom: mouseCoordinates.top - gutter,
      left: mouseCoordinates.left - tooltipRect.width / 2,
    },
    right: {
      top: mouseCoordinates.top - tooltipRect.height / 2,
      right:
        mouseCoordinates.left + cursorPaddingRight + gutter + tooltipRect.width,
      bottom: mouseCoordinates.top + tooltipRect.height / 2,
      left: mouseCoordinates.left + cursorPaddingRight + gutter,
    },
    bottom: {
      top: mouseCoordinates.top + cursorPaddingBottom + gutter,
      right: mouseCoordinates.left + tooltipRect.width / 2,
      bottom:
        mouseCoordinates.top +
        cursorPaddingBottom +
        gutter +
        tooltipRect.height,
      left: mouseCoordinates.left - tooltipRect.width / 2,
    },
    left: {
      top: mouseCoordinates.top - tooltipRect.height / 2,
      right: mouseCoordinates.left - gutter,
      bottom: mouseCoordinates.top + tooltipRect.height / 2,
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

  const { left, top, adjustedPosition } = adjustPosition(
    mousePosition,
    POSITIONS,
    gutter,
  );

  return {
    coordinates: { left, top },
    position: 'mouse',
    mousePosition: adjustedPosition,
  };
}

/**
 * Gets the coordinates and adjusted position of a tooltip.
 * Position will be flipped on the primary axis with respect to the initial position
 * if there is not enough space in the viewport.
 * Coordinates will be shifted along the secondary axis to render within viewport.
 */
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

  const { left, top, adjustedPosition } = adjustPosition(
    position,
    POSITIONS,
    gutter,
  );

  return {
    coordinates: { left, top },
    position: adjustedPosition,
    mousePosition,
  };
}
