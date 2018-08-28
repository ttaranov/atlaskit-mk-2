import { Rectangle, Camera, Vector2 } from '../../camera';
import * as jsc from 'jsverify';

const ACCEPTABLE_FLOATING_ERROR = 0.001;

const sideLenGenerator = () => jsc.integer(1, 10000);
const upscaleGenerator = () => jsc.number(1.1, 5);
const downscaleGenerator = () => jsc.number(0.1, 0.9);

describe('Rectangle', () => {
  describe('fitting rectangles', () => {
    jsc.property(
      "no side of the fitted rect is larger than the containing rect's sides",
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(original.scaleToFit(containing));
        return !(
          Math.round(fitted.width) > Math.round(containing.width) ||
          Math.round(fitted.height) > Math.round(containing.height)
        );
      },
    );

    jsc.property(
      "at least one side of the fitted rect equals a containing rect's side",
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(original.scaleToFit(containing));
        return (
          Math.round(fitted.width) === Math.round(containing.width) ||
          Math.round(fitted.height) === Math.round(containing.height)
        );
      },
    );

    jsc.property(
      'the fitted rect has the same aspect ratio as the original',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (w1, h1, w2, h2) => {
        const containing = new Rectangle(w1, h1);
        const original = new Rectangle(w2, h2);
        const fitted = original.scaled(original.scaleToFit(containing));
        return (
          original.aspectRatio - fitted.aspectRatio <= ACCEPTABLE_FLOATING_ERROR
        );
      },
    );
  });
});

describe('Camera', () => {
  describe('scaleDownToFit', () => {
    jsc.property(
      'no image is ever scaled up',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        return camera.scaleDownToFit <= 1;
      },
    );

    jsc.property(
      'an image smaller than or equal to the viewport is not scaled down',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1 + side3, side2 + side4);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        return camera.scaleDownToFit === 1;
      },
    );

    jsc.property(
      'an image larger than the viewport is scaled down',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side1 + side3, side2 + side4);
        const camera = new Camera(viewport, originalImg);
        return camera.scaleDownToFit < 1;
      },
    );
  });

  describe('scaledImg', () => {
    jsc.property(
      'any up-scaled image is larger than the original one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const fitted = camera.fittedImg;
        const upscaled = camera.scaledImg(scale);
        return fitted.width < upscaled.width && fitted.height < upscaled.height;
      },
    );

    jsc.property(
      'any down-scaled image is smaller than the original one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      downscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const downscaled = camera.scaledImg(scale);
        return (
          originalImg.width > downscaled.width &&
          originalImg.height > downscaled.height
        );
      },
    );
  });

  describe('scaledOffset', () => {
    jsc.property(
      'any up-scaled image is positioned further away from the center than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const prevOffset = new Vector2(0, 0);
        const fitted = camera.scaledOffset(prevOffset, 1, 1);
        const upscaled = camera.scaledOffset(prevOffset, 1, scale);
        return fitted.x < upscaled.x && fitted.y < upscaled.y;
      },
    );

    jsc.property(
      'any down-scaled image is positioned closer to the center than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      downscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const originalImg = new Rectangle(side3, side4);
        const camera = new Camera(viewport, originalImg);
        const prevOffset = new Vector2(0, 0);
        const fitted = camera.scaledOffset(prevOffset, 1, 1);
        const downscaled = camera.scaledOffset(prevOffset, 1, scale);
        return fitted.x > downscaled.x && fitted.y > downscaled.y;
      },
    );
  });
});
