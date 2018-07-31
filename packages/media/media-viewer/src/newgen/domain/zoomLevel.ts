const BASE_ZOOM_LEVELS = [0.06, 0.12, 0.24, 0.48, 1, 1.5, 2, 4, 6, 8];

export class ZoomLevel {
  public readonly value: number;
  public readonly zoomLevels: number[];
  public readonly min: number;
  public readonly max: number;

  constructor(public readonly initialValue: number, selectedValue?: number) {
    this.zoomLevels = BASE_ZOOM_LEVELS.map(i => i * initialValue);
    this.min = this.zoomLevels[0];
    this.max = this.zoomLevels.slice(-1)[0];
    if (!selectedValue) {
      selectedValue = initialValue;
    }
    if (selectedValue < this.min) {
      this.value = this.min;
    } else if (selectedValue > this.max) {
      this.value = this.max;
    } else {
      this.value = selectedValue;
    }
  }

  get asPercentage(): string {
    return `${Math.round(this.value * 100)} %`;
  }

  zoomIn(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index + 1];
    return nextValue ? new ZoomLevel(this.initialValue, nextValue) : this;
  }

  zoomOut(): ZoomLevel {
    const index = this.zoomLevels.indexOf(this.value);
    const nextValue = this.zoomLevels[index - 1];
    return nextValue ? new ZoomLevel(this.initialValue, nextValue) : this;
  }

  fullyZoomIn(): ZoomLevel {
    return new ZoomLevel(this.initialValue, this.max);
  }

  fullyZoomOut(): ZoomLevel {
    return new ZoomLevel(this.initialValue, this.min);
  }

  get canZoomIn(): boolean {
    return this.value < this.max;
  }

  get canZoomOut(): boolean {
    return this.value > this.min;
  }
}
