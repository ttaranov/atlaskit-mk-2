import { Rectangle } from '../../../src/newgen/domain/rectangle';
import {
  computeProjection,
  scaleDownToFit,
} from '../../../src/newgen/domain/projection';

import * as jsc from 'jsverify';

const sideLenGenerator = () => jsc.integer(1, 10000);
const upscaleGenerator = () => jsc.number(1.1, 5);
const downscaleGenerator = () => jsc.number(0.1, 0.9);

describe('Projection', () => {
  describe('scaleDownToFit', () => {
    jsc.property(
      'no image is ever scaled up',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      (side1, side2, side3, side4) => {
        const viewport = new Rectangle(side1, side2);
        const img = new Rectangle(side3, side4);
        return scaleDownToFit(img, viewport) <= 1;
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
        const img = new Rectangle(side3, side4);
        return scaleDownToFit(img, viewport) === 1;
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
        const img = new Rectangle(side1 + side3, side2 + side4);
        return scaleDownToFit(img, viewport) < 1;
      },
    );
  });

  describe('computeProjection', () => {
    jsc.property(
      'any up-scaled image is larger than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const img = new Rectangle(side3, side4);
        const fitted = computeProjection(img, viewport, 1);
        const upscaled = computeProjection(img, viewport, scale);
        return fitted.width < upscaled.width && fitted.height < upscaled.height;
      },
    );

    jsc.property(
      'any up-scaled image is positioned further away from the center than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      upscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const img = new Rectangle(side3, side4);
        const fitted = computeProjection(img, viewport, 1);
        const upscaled = computeProjection(img, viewport, scale);
        return (
          fitted.offsetLeft < upscaled.offsetLeft &&
          fitted.offsetTop < upscaled.offsetTop
        );
      },
    );

    jsc.property(
      'any down-scaled image is smaller than a fitted one',
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      sideLenGenerator(),
      downscaleGenerator(),
      (side1, side2, side3, side4, scale) => {
        const viewport = new Rectangle(side1, side2);
        const img = new Rectangle(side3, side4);
        const fitted = computeProjection(img, viewport, 1);
        const downscaled = computeProjection(img, viewport, scale);
        return (
          fitted.width > downscaled.width && fitted.height > downscaled.height
        );
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
        const img = new Rectangle(side3, side4);
        const fitted = computeProjection(img, viewport, 1);
        const downscaled = computeProjection(img, viewport, scale);
        return (
          fitted.offsetLeft > downscaled.offsetLeft &&
          fitted.offsetTop > downscaled.offsetTop
        );
      },
    );
  });
});
