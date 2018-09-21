import { ImageMetaDataTags, ImageType, FileInfo } from './types';
import { loadImage } from '../util';
import { readJPEGExifMetaData } from './parseJPEG';
import { readPNGXMPMetaData } from './parsePNG';
import { parseXMPMetaData } from './parsePNGXMP';

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
