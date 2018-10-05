import { ImageMetaDataTags, ImageType } from './types';
import { readJPEGExifMetaData } from './parseJPEG';
import { readPNGXMPMetaData } from './parsePNG';
import { parseXMPMetaData } from './parsePNGXMP';

export async function readImageMetaTags(
  file: File,
): Promise<ImageMetaDataTags | null> {
  const type = file.type;
  try {
    if (type === ImageType.PNG) {
      const xmpMetaData = await readPNGXMPMetaData(file);
      return parseXMPMetaData(xmpMetaData);
    } else if (file.type === ImageType.JPEG) {
      return await readJPEGExifMetaData(file);
    }
  } catch (e) {
    // problem parsing metadata
  }
  return null;
}
