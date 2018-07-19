import { Rectangle } from './rectangle';

export type Projection = {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
};

// Projects an image onto a viewport taking into account the requested scale factor.
export function computeProjection(
  img: Rectangle,
  viewport: Rectangle,
  scale: number,
): Projection {
  const fitted = img.scaled(scaleDownToFit(img, viewport)).scaled(scale);
  const { x, y } = fitted.differenceOfCenters(viewport);
  const { width, height } = fitted;
  return { width, height, offsetLeft: x, offsetTop: y };
}

// If the image is smaller than or equal to the viewport, it won't be scaled.
// If the image is larger than the viewport, it will be scaled down to fit.
export function scaleDownToFit(img: Rectangle, viewport: Rectangle): number {
  return Math.min(1, img.scaleToFit(viewport));
}
