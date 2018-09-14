import * as EXIF from 'exif-js';
import * as pngChunksExtract from 'png-chunks-extract';
import { fileToDataURICached } from '../util';
import {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  ImageType,
  SupportedImageMetaTag,
} from './types';

// use strong types for metadata keys
const { Orientation, XResolution, YResolution } = SupportedImageMetaTag;

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export { OrientationTransforms } from './types';

/**
 * return image dimensions plus scaleFactor metadata (only supports JPEG + PNG)
 * @param file - the image file
 */
export async function getImageInfo(file: File): Promise<ImageInfo | null> {
  const metadata = await readImageMetaData(file);
  if (!metadata) {
    return null;
  }
  const { width, height, tags } = metadata;
  let scaleFactor = 1;
  let scaleFactorFromFilename = getScaleFactorFromFile(file);
  if (scaleFactorFromFilename !== null) {
    scaleFactor = scaleFactorFromFilename;
  } else if (tags) {
    scaleFactor =
      getMetaTagNumericValue(tags, XResolution, DPI_WEB_BASELINE) /
      DPI_WEB_BASELINE;
  }
  return {
    scaleFactor,
    width,
    height,
  };
}

/**
 * parse metatags only and return orientation
 * @param file - the image file (supports JPEG + PNG)
 */
export function getOrientation(file: File): Promise<number | null> {
  return readImageMetaTags(file).then((tags: ImageMetaDataTags | null) => {
    if (tags) {
      return getMetaTagNumericValue(tags, Orientation, 1);
    }
    return null;
  });
}

/**
 * helper to get numeric value from string tag value
 * @param tags - dictionary of tags
 * @param key - the tag name
 * @param defaultValue - the default value if not found/error
 */
export function getMetaTagNumericValue(
  tags: ImageMetaDataTags,
  key: string,
  defaultValue: number,
): number {
  try {
    const num = parseFloat(tags[key]);
    if (!isNaN(num)) {
      return num;
    }
  } catch (e) {
    //
  }
  return defaultValue;
}

/**
 * get the DPI info from the file, if it uses a filename convention then that has precedence over metatags
 * @param file - the image file
 */
export function getScaleFactorFromFile(file: File): number | null {
  try {
    // filenames with scale ratio in name take precedence - eg. filename@2x.png
    const match = file.name.trim().match(/@([0-9]+)x\.[a-z]{3}$/);
    if (match) {
      return parseFloat(match[1]);
    }
  } catch (e) {
    // parse problem? unit tests should check this
  }
  return null;
}

/**
 * return image dimensions plus any available metatags (only supports JPEG + PNG)
 * @param file - the image file
 */
export async function readImageMetaData(
  file: File,
): Promise<ImageMetaData | null> {
  const src = await fileToDataURICached(file);
  const type = file.type;
  let img;
  try {
    img = await loadImage(src);
  } catch (e) {
    return null;
  }
  const { naturalWidth: width, naturalHeight: height } = img;
  const data: ImageMetaData = {
    type,
    width,
    height,
    tags: null,
  };
  if (type === ImageType.PNG) {
    const xmpMetaData = await readPNGXMPMetaData(file);
    data.tags = parseXMPMetaData(xmpMetaData);
  } else if (file.type === ImageType.JPEG) {
    const tags = await readJPEGExifMetaData(img);
    data.tags = tags;
  }
  return data;
}

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
    const xmpMetaData = Utf8ArrayToStr(chunks[3].data); //TODO: check pasted undefined data
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

/**
 * convert the given file to an ArrayBuffer
 * @param file - the file
 */
export function fileToArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      const array = new Uint8Array(reader.result as ArrayBuffer);
      resolve(array);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * load an image
 * @param src - the image src
 */
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

/**
 * convert the given UTF8 array buffer to a string
 * @param array - the array
 */
export function Utf8ArrayToStr(array: Uint8Array): string {
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
