import {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  ImageType,
  SupportedImageMetaTag,
  FileInfo,
} from './types';
import { readImageMetaTags } from './metatags';
import { readJPEGExifMetaData } from './parseJPEG';
import { readPNGXMPMetaData } from './parsePNG';
import { parseXMPMetaData } from './parsePNGXMP';

import { getFileInfo, loadImage } from '../util';

const { Orientation, XResolution } = SupportedImageMetaTag;

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export {
  OrientationTransforms,
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  FileInfo,
} from './types';

export async function getImageInfo(
  fileInfo: FileInfo,
): Promise<ImageInfo | null> {
  const metadata = await readImageMetaData(fileInfo);
  if (!metadata) {
    return null;
  }
  const { width, height, tags } = metadata;
  let scaleFactor = 1;
  let scaleFactorFromFilename = getScaleFactorFromFile(fileInfo.file);
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

export async function getOrientation(file: File): Promise<number | null> {
  const fileInfo = await getFileInfo(file);
  const tags = await readImageMetaTags(fileInfo);
  return tags ? getMetaTagNumericValue(tags, Orientation, 1) : null;
}

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

export function getScaleFactorFromFile(file: File): number | null {
  try {
    // filenames with scale ratio in name take precedence - eg. filename@2x.png
    const match = file.name.trim().match(/@([0-9]+)x\.[a-z]{3}$/);
    if (match) {
      return parseFloat(match[1]);
    }
  } catch (e) {
    // parse problem, return null
  }
  return null;
}

export async function readImageMetaData(
  fileInfo: FileInfo,
): Promise<ImageMetaData | null> {
  const { file, src } = fileInfo;
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
