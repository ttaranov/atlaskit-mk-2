import {
  akColorB300,
  akColorR300,
  akColorY300,
  akColorG300,
  akColorP300,
  akColorT300,
  akColorN300,
} from '@atlaskit/util-shared-styles';

const getPixelRatio = () => {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return devicePixelRatio / backingStoreRatio;
};

export const COLORS = [
  akColorP300,
  akColorG300,
  akColorR300,
  akColorY300,
  akColorB300,
  akColorT300,
  akColorN300,
];

export const degreesToRadians = (degs: number) => {
  return degs / 360 * (2 * Math.PI);
};

// @see https://www.html5rocks.com/en/tutorials/canvas/hidpi/
export const upscaleCanvas = (
  canvasRef: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const pixelRatio = getPixelRatio();

  if (pixelRatio !== 1) {
    const ctx = canvasRef.getContext('2d')!;
    canvasRef.width = canvasWidth * pixelRatio;
    canvasRef.height = canvasHeight * pixelRatio;
    canvasRef.style.width = canvasWidth + 'px';
    canvasRef.style.height = canvasHeight + 'px';
    ctx.scale(pixelRatio, pixelRatio);
  }
};
