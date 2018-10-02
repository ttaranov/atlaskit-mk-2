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
  width: number;
  height: number;
};

export enum ImageType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export enum SupportedImageMetaTag {
  XResolution = 'XResolution',
  YResolution = 'YResolution',
  Orientation = 'Orientation',
}

export type FileInfo = {
  file: File;
  src: string;
};

export type ExifOrientationDictionary = {
  [key: string]: number;
};

// http://sylvana.net/jpegcrop/exif_orientation.html
export const ExifOrientation: ExifOrientationDictionary = {
  'top-left': 1,
  'top-right': 2,
  'bottom-right': 3,
  'bottom-left': 4,
  'left-top': 5,
  'right-top': 6,
  'right-bottom': 7,
  'left-bottom': 8,
};
