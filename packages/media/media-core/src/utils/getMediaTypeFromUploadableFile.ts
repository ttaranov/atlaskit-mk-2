import { UploadableFile, MediaType } from '@atlaskit/media-store';

export const getMediaTypeFromUploadableFile = (
  file: UploadableFile,
): MediaType => {
  if (file.content instanceof Blob) {
    const type = file.content.type;

    if (type.indexOf('image/') === 0) {
      return 'image';
    } else if (type.indexOf('video/') === 0) {
      return 'video';
    } else {
      return 'unknown';
    }
  } else {
    return 'unknown';
  }
};
