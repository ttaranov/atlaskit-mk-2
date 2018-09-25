import { Preview, ImagePreview } from '../domain/preview';
import { getImageInfo, getFileInfo } from '@atlaskit/media-ui';

export const getPreviewFromImage = (
  file: File,
): Promise<Preview | ImagePreview> =>
  new Promise(async (resolve, reject) => {
    try {
      const fileInfo = await getFileInfo(file);
      const src = fileInfo.src;
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
    } catch (e) {
      reject(e);
    }
  });
