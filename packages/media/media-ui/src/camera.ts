export class Vector2 {
  constructor(public readonly x: number, public readonly y: number) {}

  add({ x: thatX, y: thatY }: Vector2): Vector2 {
    const { x: thisX, y: thisY } = this;
    return new Vector2(thisX + thatX, thisY + thatY);
  }

  sub({ x: thatX, y: thatY }: Vector2): Vector2 {
    const { x: thisX, y: thisY } = this;
    return new Vector2(thisX - thatX, thisY - thatY);
  }

  scaled(scalar: number): Vector2 {
    const { x, y } = this;
    return new Vector2(x * scalar, y * scalar);
  }

  map(fn: (component: number) => number): Vector2 {
    return new Vector2(fn(this.x), fn(this.y));
  }
}

export class Rectangle {
  constructor(public readonly width: number, public readonly height: number) {}

  get aspectRatio(): number {
    return this.width / this.height;
  }

  get center(): Vector2 {
    return new Vector2(this.width / 2, this.height / 2);
  }

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

export class Camera {
  constructor(
    public readonly viewport: Rectangle,
    public readonly originalImg: Rectangle,
  ) {}

  resizedViewport(newViewport: Rectangle): Camera {
    return new Camera(newViewport, this.originalImg);
  }

  get scaleToFit(): number {
    return this.originalImg.scaleToFit(this.viewport);
  }

  // If the image is smaller than or equal to the viewport, it won't be scaled.
  // If the image is larger than the viewport, it will be scaled down to fit.
  get scaleDownToFit(): number {
    return Math.min(1, this.scaleToFit);
  }

  get fittedImg(): Rectangle {
    return this.originalImg.scaled(this.scaleDownToFit);
  }

  scaledImg(newScale: number): Rectangle {
    return this.originalImg.scaled(newScale);
  }

  scaledOffset(
    prevOffset: Vector2,
    prevScale: number,
    newScale: number,
  ): Vector2 {
    const { viewport } = this;
    return prevOffset
      .add(viewport.center)
      .scaled(newScale / prevScale)
      .sub(viewport.center);
  }
}
