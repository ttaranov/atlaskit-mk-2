import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { fileToObjectURL } from '../popup/tools/fileToObjectURL';
import { ImagePreview } from '../index';

export const getPreviewFromBlob = (
  file: Blob,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    const src = fileToObjectURL(file);
    if (mediaType === 'image') {
      const img = new Image();
      const id = file.size;
      img.src = src;
      console.time(`img-load-${id}`);
      img.onload = () => {
        console.timeEnd(`img-load-${id}`);
        // console.time(`canvas-resize-${id}`);
        // const { src } = img;
        // console.log('original src', src.length);
        let { width, height } = img;
        const dimensions = { width, height };
        // const maxWidth = 300;
        // const maxHeight = 200;

        // if (width > height) {
        //   if (width > maxWidth) {
        //     height *= maxWidth / width;
        //     width = maxWidth;
        //   }
        // } else {
        //   if (height > maxHeight) {
        //     width *= maxHeight / height;
        //     height = maxHeight;
        //   }
        // }
        // const canvas = document.createElement('canvas');
        // canvas.width = width;
        // canvas.height = height;
        // const context = canvas.getContext('2d');

        // if (context) {
        //   // context.drawImage(img, 0, 0, width, height);
        //   // const imageData = canvas.toDataURL();
        //   // // // console.log('final src', imageData.length);
        //   // console.timeEnd(`canvas-resize-${id}`);
        //   // resolve({ src: imageData, dimensions } as ImagePreview);
        //   // return;
        // }

        resolve({ src, dimensions } as ImagePreview);
      };

      img.onerror = reject;
    } else {
      resolve({ src });
    }
  });
