import * as EXIF from 'exif-js';
import * as pngChunksExtract from 'png-chunks-extract';
import { fileToArrayBuffer, loadImage } from '../util';
import { utf8ByteArrayToString } from 'utf8-string-bytes';
import {
  ImageMetaDataTags,
  ImageType,
  SupportedImageMetaTag,
  FileInfo,
} from './types';
const { XResolution, YResolution } = SupportedImageMetaTag;

export async function readImageMetaTags(
  fileInfo: FileInfo,
): Promise<ImageMetaDataTags | null> {
  const { file, src } = fileInfo;
  const type = file.type;
  if (type === ImageType.PNG) {
    const xmpMetaData = await readPNGXMPMetaData(file);
    return parseXMPMetaData(xmpMetaData);
  } else if (file.type === ImageType.JPEG) {
    try {
      const img = await loadImage(src);
      return readJPEGExifMetaData(img);
    } catch (e) {
      return null;
    }
  }
  return null;
}

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

export async function readPNGXMPMetaData(file: File): Promise<string> {
  const buffer = await fileToArrayBuffer(file);
  const chunks = pngChunksExtract(buffer);
  const xmpMetaData = utf8ByteArrayToString(chunks[3].data);
  return xmpMetaData;
}

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
