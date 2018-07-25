import {
  CONTAINER_SIZE,
  CONTAINER_INNER_SIZE,
  CONTAINER_PADDING,
} from './image-navigator';

export interface ImagePosition {
  x: number;
  y: number;
}

export function constrainPos(
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
): ImagePosition {
  const scaledSize = {
    width: width * scale,
    height: height * scale,
  };

  return {
    x: Math.min(
      Math.max(CONTAINER_SIZE - CONTAINER_PADDING - scaledSize.width, x),
      CONTAINER_PADDING,
    ),
    y: Math.min(
      Math.max(CONTAINER_SIZE - CONTAINER_PADDING - scaledSize.height, y),
      CONTAINER_PADDING,
    ),
  };
}

export function constrainScale(
  newScale: number,
  minScale: number,
  width: number,
  height: number,
): number {
  const scaledSize = {
    width: width * newScale,
    height: height * newScale,
  };

  if (
    scaledSize.width < CONTAINER_INNER_SIZE ||
    scaledSize.height < CONTAINER_INNER_SIZE
  ) {
    return minScale;
  }

  return newScale;
}

export function constrainEdges(
  x: number,
  y: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
): ImagePosition {
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const newPos = {
    x,
    y,
  };
  const deltaX = newPos.x + width - (CONTAINER_PADDING + CONTAINER_INNER_SIZE);
  const deltaY = newPos.y + height - (CONTAINER_PADDING + CONTAINER_INNER_SIZE);
  const deltaNearX = newPos.x - CONTAINER_PADDING;
  const deltaNearY = newPos.y - CONTAINER_PADDING;
  if (deltaX < 0) {
    newPos.x = newPos.x + Math.abs(deltaX);
  }
  if (deltaY < 0) {
    newPos.y = newPos.y + Math.abs(deltaY);
  }
  if (deltaNearX > 0) {
    newPos.x = CONTAINER_PADDING;
  }
  if (deltaNearY > 0) {
    newPos.y = CONTAINER_PADDING;
  }
  return newPos;
}
