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
