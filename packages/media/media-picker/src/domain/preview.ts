import { ImageMetadata } from '@atlaskit/media-store';

export type NonImagePreview = {
  readonly file: Blob;
};
export type ImagePreview = NonImagePreview & {
  readonly dimensions: {
    readonly width: number;
    readonly height: number;
  };
};
export type Preview = NonImagePreview | ImagePreview;
export const isImagePreview = (preview: Preview): preview is ImagePreview =>
  !!(preview as ImagePreview).dimensions;

export const getPreviewFromMetadata = (metadata: ImageMetadata): Preview => {
  // It could happen when the file type is not image. This is the way we communicate it to integrators
  if (!metadata.original) {
    return {
      src: '',
    };
  }

  return {
    dimensions: {
      width: metadata.original.width,
      height: metadata.original.height,
    },
    src: metadata.original.url || '',
  };
};
