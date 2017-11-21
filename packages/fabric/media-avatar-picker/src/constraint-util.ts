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
  containerSize: number,
): ImagePosition {
  const scaledSize = {
    width: width * scale,
    height: height * scale,
  };

  return {
    x: Math.min(Math.max(containerSize - scaledSize.width, x), 0),
    y: Math.min(Math.max(containerSize - scaledSize.height, y), 0),
  };
}

export function constrainScale(
  newScale: number,
  currentScale: number,
  width: number,
  height: number,
  containerSize: number,
): number {
  const scaledSize = {
    width: width * newScale,
    height: height * newScale,
  };

  if (scaledSize.width < containerSize || scaledSize.height < containerSize) {
    return currentScale;
  }

  return newScale;
}
