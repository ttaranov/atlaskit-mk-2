export class ZoomLevel {
  private static readonly INITIAL_ZOOM_LEVELS = [
    0.06,
    0.12,
    0.24,
    0.48,
    1,
    1.5,
    2,
    4,
    6,
    8,
  ];

  private readonly zoomLevels: number[];
  private readonly min: number;
  private readonly max: number;

  constructor(
    public readonly value: number = 1,
    private readonly initialValue?: number,
  ) {
    // todo no duplicates!
    // todo make sure that value is OK (in bounds etc)?
    if (initialValue) {
      this.zoomLevels = ZoomLevel.INITIAL_ZOOM_LEVELS.concat(
        initialValue,
      ).sort();
    } else {
      this.zoomLevels = ZoomLevel.INITIAL_ZOOM_LEVELS;
    }

    this.min = this.zoomLevels[0];
    this.max = this.zoomLevels.slice(-1)[0];
  }

  get asPercentage(): string {
    return `${Math.round(this.value * 100)} %`;
  }

  zoomIn(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index + 1];
    return nextValue ? new ZoomLevel(nextValue, this.initialValue) : this;
  }

  zoomOut(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index - 1];
    return nextValue ? new ZoomLevel(nextValue, this.initialValue) : this;
  }

  get canZoomIn(): boolean {
    return this.value < this.max;
  }

  get canZoomOut(): boolean {
    return this.value > this.min;
  }
}
