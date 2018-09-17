import { fileToDataURICached } from '../util';
import { loadImage } from './util';
import {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  ImageType,
  SupportedImageMetaTag,
} from './types';
import {
  parseXMPMetaData,
  readImageMetaTags,
  readJPEGExifMetaData,
  readPNGXMPMetaData,
} from './metatags';

// use strong types for metadata keys
const { Orientation, XResolution } = SupportedImageMetaTag;

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export {
  OrientationTransforms,
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
} from './types';

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
