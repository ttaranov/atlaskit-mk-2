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
      if (mediaType === 'image') {
        const info = await getImageInfo(file as File);
        if (info === null) {
          const src = await fileToDataURICached(file);
          resolve({ src });
        } else {
          const { width, height, scaleFactor } = info;
          resolve({
            dimensions: {
              width,
              height,
            },
            scaleFactor: devicePixelRatio || scaleFactor,
          } as ImagePreview);
        }
      } else {
        const src = await fileToDataURICached(file);
        resolve({ src });
      }
    } catch (e) {
      reject(e);
    }
  });
