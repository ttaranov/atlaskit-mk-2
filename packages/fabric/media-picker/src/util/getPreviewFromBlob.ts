import { MediaType } from '@atlaskit/media-core';
// import { Preview } from '../domain/preview';
// import { fileToBase64 } from '../popup/tools/fileToBase64';
import { fileToObjectURL } from '../popup/tools/fileToObjectURL';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
): Promise<ImagePreview> =>
  new Promise((resolve, reject) => {
    if (mediaType !== 'image') {
      return reject();
    }
    console.time('fileToObjectURL');
    const src = fileToObjectURL(file);
    console.timeEnd('fileToObjectURL');
    console.time('new-image');
    const img = new Image();

    img.src = src;

    img.onload = () => {
      const { width, height } = img;
      const dimensions = { width, height };
      console.timeEnd('new-image');
      resolve({ src, dimensions });
    };

    img.onerror = reject;
  });
