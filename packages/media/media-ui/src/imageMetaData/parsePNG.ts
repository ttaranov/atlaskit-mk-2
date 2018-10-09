import { fileToArrayBuffer } from '../util';

let pngChunksExtract: any;
let utf8ByteArrayToString: any;

export async function readPNGXMPMetaData(file: File): Promise<string> {
  // load 3rd party libs async on demand
  pngChunksExtract =
    pngChunksExtract || (await import('png-chunks-extract')).default;
  utf8ByteArrayToString =
    utf8ByteArrayToString ||
    (await import('utf8-string-bytes')).utf8ByteArrayToString;

  const buffer = await fileToArrayBuffer(file);
  const chunks = pngChunksExtract(buffer);
  // due to the format, the 4th index of the chunks contains the useful XMP/XML string data of metatags
  return chunks[3] && chunks[3].data
    ? utf8ByteArrayToString(chunks[3].data)
    : '';
}
