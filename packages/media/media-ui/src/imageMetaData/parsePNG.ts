import * as pngChunksExtract from 'png-chunks-extract';
import { fileToArrayBuffer } from '../util';
import { utf8ByteArrayToString } from 'utf8-string-bytes';

export async function readPNGXMPMetaData(file: File): Promise<string> {
  const buffer = await fileToArrayBuffer(file);
  const chunks = pngChunksExtract(buffer);
  return chunks[3] && chunks[3].data
    ? utf8ByteArrayToString(chunks[3].data)
    : '';
}
