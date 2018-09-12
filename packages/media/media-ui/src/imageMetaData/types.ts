export type ImageMetaDataTags = {
  [key: string]: string;
};

export type ImageMetaData = {
  type: string;
  width: number;
  height: number;
  tags: ImageMetaDataTags | null;
};

export type ImageInfo = {
  scaleFactor: number;
  orientation: number;
  width: number;
  height: number;
};

export enum ImageType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
};

export enum SupportedImageMetaTag {
  XResolution = 'XResolution',
  YResolution = 'YResolution',
  Orientation = 'Orientation',
};

export const OrientationTransforms: { [key: number]: string } = {
  1: '',
  2: 'rotateY(180deg)',
  3: 'rotate(180deg)',
  4: 'rotate(180deg) rotateY(180deg)',
  5: 'rotate(270deg) rotateY(180deg)',
  6: 'rotate(90deg)',
  7: 'rotate(90deg) rotateY(180deg)',
  8: 'rotate(270deg)',
};
