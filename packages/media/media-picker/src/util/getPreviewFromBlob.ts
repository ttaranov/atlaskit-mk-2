import { MediaType } from '@atlaskit/media-core';
import { getImageInfo } from '@atlaskit/media-ui';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    fileToBase64(file)
      .then(async src => {
        if (mediaType === 'image') {
          // we are passing src (optional) since it is needed to get image dimensions,
          // and we've already got it from fileToBase64 call above. Otherwise getImageInfo
          // will need to create base64 dataUri from File/Blob to get image dimensions.
          const metadata = await getImageInfo(file as File, src);
          if (!metadata) {
            resolve({ src });
          } else {
            const { width, height, scaleFactor, orientation } = metadata;
            resolve({
              src,
              dimensions: {
                width,
                height,
              },
              scaleFactor,
              orientation,
            } as ImagePreview);
          }
        } else {
          resolve({ src });
        }
      })
      .catch(reject);
  });
