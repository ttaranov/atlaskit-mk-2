import * as EXIF from 'exif-js';
import * as pngChunksExtract from 'png-chunks-extract';
import { fileToArrayBuffer, loadImage } from './util';
import { unpack } from 'utf8-buffer';
import { fileToDataURICached } from '../util';
import { ImageMetaDataTags, ImageType, SupportedImageMetaTag } from './types';
const { XResolution, YResolution } = SupportedImageMetaTag;

/**
 * return image metatags (only supports JPEG + PNG)
 * @param file - the image file
 */
export async function readImageMetaTags(
  file: File,
): Promise<ImageMetaDataTags | null> {
  const type = file.type;
  if (type === ImageType.PNG) {
    return readPNGXMPMetaData(file).then(xmpMetaData => {
      return parseXMPMetaData(xmpMetaData);
    });
  } else if (file.type === ImageType.JPEG) {
    try {
      const src = await fileToDataURICached(file);
      const img = await loadImage(src);
      return readJPEGExifMetaData(img);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * use exif-js to parse the Exif metadata from the given jpg image (exif-js takes an image as input)
 * @param img - the image element
 */
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

/**
 * use png-chunks-extract to parse the Exif/XMP metadata from the given png image
 * @param file - the png file
 */
export function readPNGXMPMetaData(file: File): Promise<string> {
  return fileToArrayBuffer(file).then(buffer => {
    const chunks = pngChunksExtract(buffer);
    const xmpMetaData = unpack(chunks[3].data);
    return xmpMetaData;
  });
}

/**
 * parse the xml-like xmp metadata
 * @param xmpMetaData - the xmp meta data
 */
export function parseXMPMetaData(xmpMetaData: string): ImageMetaDataTags {
  const metadata: ImageMetaDataTags = {};
  const tags = xmpMetaData.match(/<(tiff|exif):.+>/g);
  if (tags) {
    tags.forEach((tag: string) => {
      const match = tag.match(/<(tiff|exif):([^>]+)>([^<]+)/);
      if (match) {
        const name = match[2];
        metadata[name] = match[3];
      }
    });
  }
  return metadata;
}
