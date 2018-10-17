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

  clone() {
    return new Vector2(this.x, this.y);
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
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

  resized(width: number, height: number): Rectangle {
    return new Rectangle(width, height);
  }

  // Computes the scaling factor that needs to be applied to this
  // Rectangle so that it
  // - is fully visible inside of the containing Rectangle
  // - is the LARGEST possible size
  // - maintains the original aspect ratio (no distortion)
  scaleToFitLargestSide(containing: Rectangle): number {
    const widthRatio = containing.width / this.width;
    const heightRatio = containing.height / this.height;
    if (widthRatio <= heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  }

  // Computes the scaling factor that needs to be applied to this
  // Rectangle so that it
  // - is fully visible inside of the containing Rectangle
  // - is the SMALLEST possible size
  // - maintains the original aspect ratio (no distortion)
  scaleToFitSmallestSide(containing: Rectangle): number {
    const widthRatio = containing.width / this.width;
    const heightRatio = containing.height / this.height;
    if (widthRatio >= heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  }

  clone(): Rectangle {
    return new Rectangle(this.width, this.height);
  }
}

export class Bounds extends Rectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {
    super(width, height);
  }

  get center(): Vector2 {
    return new Vector2(this.x, this.y).add(
      new Vector2(this.width / 2, this.height / 2),
    );
  }

  scaled(scale: number): Rectangle {
    return new Bounds(
      this.x * scale,
      this.y * scale,
      this.width * scale,
      this.height * scale,
    );
  }

  clone(): Bounds {
    return new Bounds(this.x, this.y, this.width, this.height);
  }

  get left() {
    return this.x;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
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
    return this.originalImg.scaleToFitLargestSide(this.viewport);
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

export const DEFAULT_MAX_ZOOM = 2;

export class ItemViewer {
  containerRect: Rectangle;
  itemRect: Rectangle;
  originalItemRect: Rectangle;
  margin: number = 28;
  zoom: number = 0;
  maxZoom: number = 2;
  origin: Vector2;
  dragOrigin?: Vector2;
  useConstraints: boolean;

  constructor(
    containerWidth: number,
    containerHeight: number,
    itemWidth: number,
    itemHeight: number,
    margin: number = 28,
    zoom: number = 0,
    maxZoom: number = DEFAULT_MAX_ZOOM,
    originX: number = 0,
    originY: number = 0,
    useConstraints: boolean = true,
  ) {
    this.containerRect = new Rectangle(containerWidth, containerHeight);
    this.itemRect = new Rectangle(itemWidth, itemHeight);
    this.originalItemRect = this.itemRect.clone();
    this.margin = margin;
    this.zoom = zoom;
    this.maxZoom = maxZoom;
    this.origin = new Vector2(originX, originY);
    this.useConstraints = useConstraints;
  }

  zoomToFit() {
    const { itemRect, containerRect, margin } = this;
    const containerInnerRect = new Rectangle(
      containerRect.width - margin * 2,
      containerRect.height - margin * 2,
    );
    const scaleFactor = itemRect.scaleToFitSmallestSide(containerInnerRect);
    this.itemRect = this.itemRect.scaled(scaleFactor);
    this.origin = new Vector2(0, 0);
  }

  get itemBounds(): Bounds {
    const { margin, origin, itemRect, zoom, maxZoom } = this;
    const x = margin + origin.x;
    const y = margin + origin.y;
    const maxWidthDiff = itemRect.width * maxZoom - itemRect.width;
    const maxHeightDiff = itemRect.height * maxZoom - itemRect.height;
    const width = itemRect.width + maxWidthDiff * zoom;
    const height = itemRect.height + maxHeightDiff * zoom;
    return new Bounds(x, y, width, height);
  }

  startDrag() {
    this.dragOrigin = this.origin.clone();
  }

  drag(delta: Vector2) {
    const { dragOrigin } = this;
    if (dragOrigin) {
      let newOriginX = dragOrigin.x + delta.x;
      let newOriginY = dragOrigin.y + delta.y;
      this.origin = new Vector2(newOriginX, newOriginY);
      if (this.useConstraints) {
        this.applyConstraints();
      }
    }
  }

  applyConstraints() {
    const { containerRect, margin, origin } = this;
    let newOriginX = origin.x;
    let newOriginY = origin.y;
    const innerBounds = new Bounds(
      margin,
      margin,
      containerRect.width - margin * 2,
      containerRect.height - margin * 2,
    );
    const itemBounds = this.itemBounds;
    if (
      itemBounds.right >= innerBounds.right &&
      itemBounds.left >= innerBounds.left
    ) {
      newOriginX += innerBounds.left - itemBounds.left;
    }
    if (
      itemBounds.bottom >= innerBounds.bottom &&
      itemBounds.top >= innerBounds.top
    ) {
      newOriginY += innerBounds.top - itemBounds.top;
    }
    if (
      itemBounds.top <= innerBounds.top &&
      itemBounds.bottom <= innerBounds.bottom
    ) {
      newOriginY += innerBounds.bottom - itemBounds.bottom;
    }
    if (
      itemBounds.left <= innerBounds.left &&
      itemBounds.right <= innerBounds.right
    ) {
      newOriginX += innerBounds.right - itemBounds.right;
    }
    this.origin = new Vector2(newOriginX, newOriginY);
  }

  setContainerSize(width: number, height: number) {
    this.containerRect = this.containerRect.resized(width, height);
  }

  setItemSize(width: number, height: number) {
    this.itemRect = this.itemRect.resized(width, height);
    this.originalItemRect = this.itemRect.clone();
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
    if (this.useConstraints) {
      this.applyConstraints();
    }
  }

  setUseConstraints(useConstraints: boolean) {
    this.useConstraints = useConstraints;
    this.applyConstraints();
    if (this.useConstraints) {
      this.zoomToFit();
    }
  }

  reset() {
    this.itemRect = this.originalItemRect.clone();
    this.zoom = 0;
    this.origin = new Vector2(0, 0);
  }
}
