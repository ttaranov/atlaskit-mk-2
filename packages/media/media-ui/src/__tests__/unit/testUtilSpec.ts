import {
  dataURItoFile,
  // fileToArrayBuffer,
  fileToDataURI,
  // getFileInfo,
  // loadImage,
} from '../../util';

const tinyPngDataURI = 'data:image/png;base64,';
const tinyBadDataURI = 'very-bad-data';

describe('Image Meta Data Util', () => {
  const tinyPngFile = dataURItoFile(tinyPngDataURI);

  describe('convert between dataURI and File', () => {
    it('should convert dataURI to File', () => {
      expect(tinyPngFile).toBeInstanceOf(File);
    });

    it('should preserve mimeType', () => {
      expect(tinyPngFile.type).toEqual('image/png');
    });

    it('should convert File to dataURI', async () => {
      const dataURI = await fileToDataURI(tinyPngFile);
      expect(dataURI).toEqual(tinyPngDataURI);
    });

    it('should still convert bad dataURI to File', () => {
      const file = dataURItoFile(tinyBadDataURI);
      expect(file).toBeInstanceOf(File);
    });

    it('should still convert invalid File to dataURI', async () => {
      const badFile = new File([], 'filename', { type: 'bad/type' });
      const dataURI = await fileToDataURI(badFile);
      expect(typeof dataURI).toBe('string');
    });

    it('should throw message on empty dataURI', () => {
      expect(() => dataURItoFile('')).toThrowError('dataURI not found');
    });
  });
});
