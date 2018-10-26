import { Camera } from './rendering';
import { Size, Point } from './scene';

export class Positioning implements Camera {
  private static horImageOffset = 24.0;
  private static verImageOffset = 16.0;

  private static minScale = 0.1;
  private static maxScale = 8.0;

  windowSize: Size;
  scale: number;
  center: Point;

  constructor(windowSize: Size, private onCameraChanged: () => void) {
    this.windowSize = windowSize;
    this.scale = 1.0;
    this.center = { x: 0, y: 0 };
  }

  backImageLoaded(imageSize: Size) {
    const { width: imageWidth, height: imageHeight } = imageSize;
    const { width: windowWidth, height: windowHeight } = this.windowSize;

    const horScaleCalculated =
      (windowWidth - 2 * Positioning.horImageOffset) / imageWidth;
    const verScaleCalculated =
      (windowHeight - 2 * Positioning.verImageOffset) / imageHeight;

    const horScale = Math.min(horScaleCalculated, 1.0);
    const verScale = Math.min(verScaleCalculated, 1.0);

    this.scale = Math.min(horScale, verScale);
    this.center = { x: imageWidth / 2, y: imageHeight / 2 };

    this.validateAndUpdate();
  }

  private validateAndUpdate() {
    this.scale = Math.min(
      Math.max(this.scale, Positioning.minScale),
      Positioning.maxScale,
    );
    this.onCameraChanged();
  }
}
