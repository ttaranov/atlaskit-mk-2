import { MediaType } from '@atlaskit/media-core';
import { getImageInfo, fileToDataURICached } from '@atlaskit/media-ui';
import { Preview } from '../domain/preview';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
  devicePixelRatio?: number,
): Promise<Preview> =>
  new Promise(async (resolve, reject) => {
    try {
      const src = await fileToDataURICached(file);
      if (mediaType === 'image') {
        const info = await getImageInfo(file as File);
        if (info === null) {
          resolve({ src });
        } else {
          const { width, height, scaleFactor } = info;
          resolve({
            src,
            dimensions: {
              width,
              height,
            },
            scaleFactor: devicePixelRatio || scaleFactor,
          } as ImagePreview);
        }
      } else {
        resolve({ src });
      }
    } catch (e) {
      reject(e);
    }
  });
