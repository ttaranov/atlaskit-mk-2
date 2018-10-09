import { Preview, ImagePreview } from '../domain/preview';
import { getImageInfo, getFileInfo } from '@atlaskit/media-ui';

export const getPreviewFromImage = (
  file: File,
  devicePixelRatio?: number,
): Promise<Preview> =>
  new Promise(async (resolve, reject) => {
    try {
      const fileInfo = await getFileInfo(file);
      const src = fileInfo.src;
      const imageInfo = await getImageInfo(fileInfo);
      if (imageInfo === null) {
        resolve({ src });
      } else {
        const { width, height, scaleFactor } = imageInfo;
        const preview: ImagePreview = {
          src,
          dimensions: {
            width,
            height,
          },
          scaleFactor:
            typeof devicePixelRatio === 'undefined'
              ? scaleFactor
              : devicePixelRatio,
        };
        resolve(preview);
      }
    } catch (e) {
      reject(e);
    }
  });
