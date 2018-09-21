declare var global: any;

import {
  dataURItoFile,
  fileToArrayBuffer,
  fileToDataURI,
  getFileInfo,
  loadImage,
} from '../../util';
import { tinyPngDataURI, smallPngDataURI } from './imageHelpers';

const tinyBadDataURI = 'very-bad-data';

describe('Image Meta Data Util', () => {
  describe('dataURItoFile()', () => {
    const tinyPngFile = dataURItoFile(tinyPngDataURI);

    it('should preserve mimeType', () => {
      expect(tinyPngFile.type).toEqual('image/png');
    });

    it('should still convert bad dataURI to File', () => {
      const file = dataURItoFile(tinyBadDataURI);
      expect(file).toBeInstanceOf(File);
    });

    it('should throw message on empty dataURI', () => {
      expect(() => dataURItoFile('')).toThrowError('dataURI not found');
    });
  });

  describe('fileToDataURI()', () => {
    const tinyPngFile = dataURItoFile(tinyPngDataURI);

    it('should convert File to dataURI', async () => {
      const dataURI = await fileToDataURI(tinyPngFile);
      expect(dataURI).toEqual(tinyPngDataURI);
    });
    it('should still convert invalid File to dataURI', async () => {
      const badFile = new File([], 'filename', { type: 'bad/type' });
      const dataURI = await fileToDataURI(badFile);
      expect(typeof dataURI).toBe('string');
    });
  });

  describe('fileToArrayBuffer()', () => {
    const file = dataURItoFile(smallPngDataURI);

    it('should return a Uint8Array with data from a file with data', async () => {
      const array = await fileToArrayBuffer(file);
      expect(array).toBeInstanceOf(Uint8Array);
      expect(array.length).toBeGreaterThan(0);
    });

    it('should return an empty array from an empty file', async () => {
      const emptyFile = new File([], 'some-filename', { type: 'some-type' });
      const array = await fileToArrayBuffer(emptyFile);
      expect(array).toHaveLength(0);
    });
  });

  describe('getFileInfo()', () => {
    const tinyPngFile = dataURItoFile(tinyPngDataURI);

    it('should return a FileInfo structure with src when passed a File', async () => {
      const fileInfo = await getFileInfo(tinyPngFile);
      const dataURI = await fileToDataURI(tinyPngFile);
      expect(fileInfo.file).toEqual(tinyPngFile);
      expect(fileInfo.src).toEqual(dataURI);
    });

    it('should use passed src instead of generating', async () => {
      const fileInfo = await getFileInfo(tinyPngFile, 'some-dataURI');
      expect(fileInfo.file).toEqual(tinyPngFile);
      expect(fileInfo.src).toEqual('some-dataURI');
    });
  });

  describe('loadImage', () => {
    let globalImage: any;

    beforeEach(() => {
      class MockImage extends global.Image {
        constructor() {
          super();
          setImmediate(() => this.onload());
        }
      }
      global.Image = MockImage;
    });

    afterEach(() => {
      global.Image = globalImage;
    });

    it('should return an image async', async () => {
      const img = await loadImage(tinyPngDataURI);
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.src).toEqual(tinyPngDataURI);
    });
  });
});
