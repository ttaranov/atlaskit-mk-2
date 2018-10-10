import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);

    if (mediaType === 'image') {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        const dimensions = { width: img.width, height: img.height };

        URL.revokeObjectURL(src);
        resolve({ file, dimensions } as ImagePreview);
      };
      img.onerror = reject;
    } else {
      resolve({ file });
    }
  });
