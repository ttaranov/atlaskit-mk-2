import { MediaType } from '@atlaskit/media-core';
import { Preview } from '../domain/preview';
import { fileToBase64 } from '../popup/tools/fileToBase64';
import { ImagePreview } from '../index';
import { readSupportedImageMetaData } from '../../../media-ui/src/imageMetaData';

export const getPreviewFromBlob = (
  file: File,
  mediaType: MediaType,
): Promise<Preview> =>
  new Promise((resolve, reject) => {
    fileToBase64(file)
      .then(src => {
        if (mediaType === 'image') {
          readSupportedImageMetaData(src).then(metadata => {
            let scaleFactor = 1;
            if (file.name) {
              // filenames with scale ratio in name take precedence - eg. filename@2x.png
              const match = file.name.trim().match(/@([0-9]+)x\.[a-z]{3}$/);
              if (match) {
                scaleFactor = parseInt(match[1], 10);
              }
            } else if (metadata.tags) {
              // then we use metadata
              const dpi = metadata.tags.XResolution as number;
              scaleFactor = dpi / 72;
            }
            resolve({
              src,
              dimensions: {
                width: metadata.width,
                height: metadata.height,
              },
              scaleFactor,
            } as ImagePreview);
          });
        } else {
          resolve({ src });
        }
      })
      .catch(reject);
  });
