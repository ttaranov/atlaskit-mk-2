import { Preview, ImagePreview } from '../domain/preview';
import { getImageInfo, getFileInfo } from '@atlaskit/media-ui';

export async function getPreviewFromImage(
  file: File,
  devicePixelRatio?: number,
): Promise<Preview> {
  const fileInfo = await getFileInfo(file);
  const src = fileInfo.src;
  const imageInfo = await getImageInfo(fileInfo);
  if (imageInfo === null) {
    return { src };
  } else {
    const { width, height, scaleFactor } = imageInfo;
    const preview: ImagePreview = {
      src,
      dimensions: {
        width,
        height,
      },
      scaleFactor: devicePixelRatio || scaleFactor,
    };
    return preview;
  }
}

export const SCALE_FACTOR_DEFAULT = 1;
