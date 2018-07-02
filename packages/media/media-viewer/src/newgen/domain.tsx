import { MediaItemType } from '@atlaskit/media-core';

export type ImageAnnotatedCallback = (item: Identifier) => void;

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type ItemSource =
  | { kind: 'COLLECTION'; collectionName: string; pageSize: number }
  | { kind: 'ARRAY'; items: Identifier[] };

export type Outcome<Data, Err> =
  | {
      status: 'PENDING';
    }
  | {
      status: 'SUCCESSFUL';
      data: Data;
    }
  | {
      status: 'FAILED';
      err: Err;
    };

export type MediaViewerFeatureFlags = {
  nextGen?: boolean;
  customVideoPlayer?: boolean;
  annotationEditor?: boolean;
};

export class ZoomLevel {
  private static readonly ZOOM_LEVELS = [
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
  public static readonly MIN = ZoomLevel.ZOOM_LEVELS[0];
  public static readonly MAX = ZoomLevel.ZOOM_LEVELS.slice(-1)[0];

  constructor(public readonly value: number = 1) {
    if (value < ZoomLevel.MIN) {
      this.value = ZoomLevel.MIN;
    }
    if (value > ZoomLevel.MAX) {
      this.value = ZoomLevel.MAX;
    }
  }

  get asPercentage(): string {
    return `${this.value * 100} %`;
  }

  zoomIn(): ZoomLevel {
    const index = ZoomLevel.ZOOM_LEVELS.indexOf(this.value);
    const nextValue = ZoomLevel.ZOOM_LEVELS[index + 1];
    return nextValue ? new ZoomLevel(nextValue) : this;
  }

  zoomOut(): ZoomLevel {
    const index = ZoomLevel.ZOOM_LEVELS.indexOf(this.value);
    const nextValue = ZoomLevel.ZOOM_LEVELS[index - 1];
    return nextValue ? new ZoomLevel(nextValue) : this;
  }

  get canZoomIn(): boolean {
    return this.value < ZoomLevel.MAX;
  }

  get canZoomOut(): boolean {
    return this.value > ZoomLevel.MIN;
  }
}
