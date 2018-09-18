import { dataURItoFile, fileToDataURI, fileToDataURICached } from '../../util';

const tinyImageDataUri =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

describe('Image Meta Data Util', () => {
  const tinyFile = dataURItoFile(tinyImageDataUri);

  describe('convert between dataURI and File', () => {
    it('should convert dataURI to File', () => {
      expect(tinyFile).toBeInstanceOf(File);
    });

    it('should convert File to dataURI', async () => {
      const dataURI = await fileToDataURI(tinyFile);
      expect(dataURI).toEqual(tinyImageDataUri);
    });

    it('should throw message on empty dataURI', () => {
      expect(() => dataURItoFile('')).toThrowError('dataURI not found');
    });
  });

  describe('Caching dataURI src with File', () => {
    it('should not know dataURI for File by default', () => {
      expect(tinyFile).not.toHaveProperty('__base64Src');
    });

    it('should store dataURI with File when first accessed', async () => {
      const dataURI = await fileToDataURICached(tinyFile);
      expect(dataURI).toEqual(tinyImageDataUri);
      expect(tinyFile).toHaveProperty('__base64Src');
    });
  });
});
