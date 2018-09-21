import * as EXIF from 'exif-js';
import { SupportedImageMetaTag } from './types';

const { XResolution, YResolution } = SupportedImageMetaTag;

export function readJPEGExifMetaData(img: HTMLImageElement): Promise<any> {
  return new Promise((resolve, reject) => {
    EXIF.getData(img, () => {
      const tags = EXIF.getAllTags(img);
      for (let key in tags) {
        if (
          (key === XResolution || key === YResolution) &&
          tags[key].numerator
        ) {
          // just take the numerator value to simplify returned value
          tags[key] = tags[key].numerator;
        }
      }
      resolve(tags);
    }).catch(reject);
  });
}
