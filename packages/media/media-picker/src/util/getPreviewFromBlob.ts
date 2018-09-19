import { MediaType } from '@atlaskit/media-core';
import { getImageInfo, getFileInfo } from '@atlaskit/media-ui';
import { Preview } from '../domain/preview';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  blob: Blob,
  mediaType: MediaType,
  devicePixelRatio?: number,
): Promise<Preview> =>
  new Promise(async (resolve, reject) => {
    try {
      const info = await getFileInfo(blob);
      if (mediaType === 'image') {
        const info = await getImageInfo(blob as File);
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
