const rusha = require('rusha');

import { Hasher } from './hasher';

const estimatedChunkSize = 4 * 1024 * 1024; // hint for Rusha

export class SimpleHasher implements Hasher {
  hash(chunk: any): void {
    const { file } = chunk.fileObj;
    const chunkBlob = file.slice(chunk.startByte, chunk.endByte);

    const fileReader = new FileReader();
    fileReader.onload = event => {
      const arrayBuffer = (event.target as FileReader).result;
      chunk.hash = new rusha(estimatedChunkSize).digestFromArrayBuffer(
        arrayBuffer,
      );
      chunk.preprocessFinished();
    };

    fileReader.readAsArrayBuffer(chunkBlob);
  }
}
