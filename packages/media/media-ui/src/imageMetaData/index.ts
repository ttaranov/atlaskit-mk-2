import {
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  SupportedImageMetaTag,
  FileInfo,
} from './types';
import { readImageMetaTags } from './metatags';

import { getFileInfo, loadImage } from '../util';

const { Orientation, XResolution } = SupportedImageMetaTag;

// http://bonfx.com/why-is-the-web-72-dpi-and-print-300-dpi/
const DPI_WEB_BASELINE = 72;

export { ImageInfo, ImageMetaData, ImageMetaDataTags, FileInfo } from './types';

export async function getImageInfo(
  fileInfo: FileInfo,
): Promise<ImageInfo | null> {
  const metadata = await readImageMetaData(fileInfo);
  if (!metadata) {
    return null;
  }
  const { width, height, tags } = metadata;
  const scaleFactor = getScaleFactor(fileInfo.file, tags);
  return {
    scaleFactor,
    width,
    height,
  };
}

export function getScaleFactor(
  file: File,
  tags: ImageMetaDataTags | null,
): number {
  let scaleFactor = 1;
  let scaleFactorFromFilename = getScaleFactorFromFile(file);
  if (scaleFactorFromFilename !== null) {
    scaleFactor = scaleFactorFromFilename;
  } else if (tags) {
    scaleFactor =
      getMetaTagNumericValue(tags, XResolution, DPI_WEB_BASELINE) /
      DPI_WEB_BASELINE;
  }
  return scaleFactor;
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
  const tags = await readImageMetaTags(fileInfo);
  const data: ImageMetaData = {
    type,
    width,
    height,
    tags,
  };
  return data;
}
