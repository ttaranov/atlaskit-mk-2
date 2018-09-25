import * as EXIF from 'exif-js';
import { SupportedImageMetaTag, ImageMetaDataTags } from './types';

const { XResolution, YResolution } = SupportedImageMetaTag;

export function readJPEGExifMetaData(
  img: HTMLImageElement,
): Promise<ImageMetaDataTags> {
  return new Promise((resolve, reject) => {
    EXIF.getData(img, () => {
      try {
        const tags = EXIF.getAllTags(img);
        for (let key in tags) {
          const value = tags[key];
          if ((key === XResolution || key === YResolution) && value.numerator) {
            // just take the numerator value to simplify returned value
            tags[key] = value.numerator;
          }
          if (typeof tags[key] === 'number') {
            // exif-js converts to numbers where possible - to keep everything the same between jpeg & png we keep as strings
            tags[key] = `${tags[key]}`;
          }
        }
        resolve(tags);
      } catch (e) {
        reject(e);
      }
    });
  });
}
