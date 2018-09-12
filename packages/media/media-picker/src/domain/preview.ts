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
