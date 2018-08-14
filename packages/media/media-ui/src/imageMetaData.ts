import * as EXIF from 'exif-js';
import * as pngChunksExtract from 'png-chunks-extract';
import { dataURItoFile } from '../../media-avatar-picker/src/util';

export type ImageMetaDataTags = {
  [key: string]: string | number;
};

export type ImageMetaData = {
  type: string;
  width: number;
  height: number;
  tags: ImageMetaDataTags | null;
};

export enum ImageType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

// currently only support for JPEG Exif or PNG XMP tags
export function readImageMetaData(src: string): Promise<ImageMetaData> {
  return loadImage(src).then(img => {
    const file = dataURItoFile(src);
    const type = file.type;
    const { naturalWidth: width, naturalHeight: height } = img;
    const data: ImageMetaData = {
      type,
      width,
      height,
      tags: null,
    };
    if (type === ImageType.PNG) {
      return readPNGMetaData(file).then(xmpMetaData => {
        data.tags = parseXMPMetaData(xmpMetaData);
        return data;
      });
    } else if (file.type === ImageType.JPEG) {
      return readJPEGMetaData(img).then(tags => {
        data.tags = tags;
        return data;
      });
    }
    return data;
  });
}

export function readSupportedImageMetaData(
  src: string,
): Promise<ImageMetaData> {
  return readImageMetaData(src).then(metadata => {
    const tags = metadata.tags;
    const supportedMetaData: ImageMetaDataTags = {};
    if (tags) {
      supportedMetaData['Orientation'] = tags['Orientation'];
      supportedMetaData['XResolution'] = tags['XResolution'];
      supportedMetaData['YResolution'] = tags['YResolution'];
      if (tags['PixelXDimension'] && metadata.type === ImageType.PNG) {
        // override XResolution/YResolution with PixelXDimension/PixelYDimension
        // (this is how PNG stores it)
        supportedMetaData['XResolution'] = tags['PixelXDimension'];
        supportedMetaData['YResolution'] = tags['PixelYDimension'];
      }
      metadata.tags = supportedMetaData;
    }
    return metadata;
  });
}

export function readJPEGMetaData(img: HTMLImageElement): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      EXIF.getData(img, () => {
        const tags = EXIF.getAllTags(img);
        for (let key in tags) {
          if (
            (key === 'XResolution' || key === 'YResolution') &&
            tags[key].numerator
          ) {
            // just take the numerator value to simplify returned map
            tags[key] = tags[key].numerator;
          }
        }
        resolve(tags);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function readPNGMetaData(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const chunks = pngChunksExtract(buffer);
      const xmpMetaData = Utf8ArrayToStr(chunks[3].data);
      resolve(xmpMetaData);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
}

export function parseXMPMetaData(xmpMetaData: string): ImageMetaDataTags {
  const metadata: ImageMetaDataTags = {};
  const tags = xmpMetaData.match(/<(tiff|exif):.+>/g);
  if (tags) {
    tags.forEach((tag: string) => {
      const match = tag.match(/<(tiff|exif):([^>]+)>([^<]+)/);
      if (match) {
        const name = match[2];
        let value: string | number = match[3];
        if (`${value}` === parseFloat(value).toString()) {
          value = parseFloat(value);
        }
        metadata[name] = value;
      }
    });
  }
  return metadata;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
}

export function Utf8ArrayToStr(array: Uint8Array) {
  let out, i, len, c;
  let char2, char3;

  out = '';
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        );
        break;
    }
  }

  return out;
}
