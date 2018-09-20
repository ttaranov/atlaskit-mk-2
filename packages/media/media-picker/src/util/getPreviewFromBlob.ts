import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { getImageInfo, getFileInfo, loadImage } from '@atlaskit/media-ui';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    fileToBase64(file)
      .then(async src => {
        if (mediaType === 'image') {
          const img = await loadImage(src);
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          resolve({ src, dimensions } as ImagePreview);
        } else {
          resolve({ src });
        }
      })
      .catch(reject);
  });

export const getPreviewWithMetaDataFromBlob = (
  file: File,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise(async (resolve, reject) => {
    try {
      const fileInfo = await getFileInfo(file);
      const src = fileInfo.src;
      if (mediaType === 'image') {
        const imageInfo = await getImageInfo(fileInfo);
        if (imageInfo === null) {
          resolve({ src });
        } else {
          const { width, height, scaleFactor } = imageInfo;
          resolve({
            src,
            dimensions: {
              width,
              height,
            },
            scaleFactor,
          } as ImagePreview);
        }
      } else {
        resolve({ src });
      }
    } catch (e) {
      reject(e);
    }
  });
