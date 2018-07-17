export class Rectangle {
  constructor(public readonly width: number, public readonly height: number) {}

  // Returns the aspect ratio between width and height.
  get aspectRatio(): number {
    return this.width / this.height;
  }

  // Returns a new Rectangle with both sides scaled by `scale`.
  scaled(scale: number): Rectangle {
    return new Rectangle(this.width * scale, this.height * scale);
  }

  // Computes the scaling factor that needs to be applied to this
  // Rectangle so that it
  // - is fully visible inside of the containing Rectangle
  // - is the largest possible size
  // - maintains the original aspect ratio (no distortion)
  scaleToFit(containing: Rectangle): number {
    const widthRatio = containing.width / this.width;
    const heightRatio = containing.height / this.height;
    if (widthRatio <= heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  }
}
