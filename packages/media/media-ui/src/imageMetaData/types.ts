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

// http://sylvana.net/jpegcrop/exif_orientation.html
export const ExifOrientation: { [key: string]: number } = {
  'top-left': 1, // none
  'top-right': 2, // flip horizontal
  'bottom-right': 3, // rotate 180
  'bottom-left': 4, // flip vertical
  'left-top': 5, // transpose
  'right-top': 6, // rotate 90
  'right-bottom': 7, // transverse
  'left-bottom': 8, // rotate 270
};
