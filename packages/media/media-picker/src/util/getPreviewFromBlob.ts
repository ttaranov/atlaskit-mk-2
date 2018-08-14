import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
  scaleFactor: number = window.devicePixelRatio,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    fileToBase64(file)
      .then(src => {
        if (mediaType === 'image') {
          const img = new Image();
          img.src = src;

          img.onload = () => {
            const { src } = img;
            const dimensions = { width: img.width, height: img.height };

            resolve({ src, dimensions, scaleFactor } as ImagePreview);
          };

          img.onerror = reject;
        } else {
          resolve({ src });
        }
      })
      .catch(reject);
  });
