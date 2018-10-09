import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { loadImage } from '@atlaskit/media-ui';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  blob: Blob,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    fileToBase64(blob)
      .then(async src => {
        if (mediaType === 'image') {
          const {
            naturalWidth: width,
            naturalHeight: height,
          } = await loadImage(src);
          const dimensions = {
            width,
            height,
          };
          resolve({ src, dimensions } as ImagePreview);
        } else {
          resolve({ src });
        }
      })
      .catch(reject);
  });
