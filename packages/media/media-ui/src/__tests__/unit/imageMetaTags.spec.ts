const mockXMPMetaData = {};
const readJPEGExifMetaData = jest.fn().mockReturnValue('jpgMetaData');
const readPNGXMPMetaData = jest.fn().mockReturnValue('pngMetaData');
const parseXMPMetaData = jest.fn().mockReturnValue(mockXMPMetaData);

jest.mock('../../imageMetaData/parseJPEG', () => ({ readJPEGExifMetaData }));
jest.mock('../../imageMetaData/parsePNG', () => ({ readPNGXMPMetaData }));
jest.mock('../../imageMetaData/parsePNGXMP', () => ({ parseXMPMetaData }));

import { readImageMetaTags } from '../../imageMetaData/metatags';

describe('Image Meta Tags', () => {
  const pngFile = new File([], 'filename.png', { type: 'image/png' });
  const jpegFile = new File([], 'filename.jpeg', { type: 'image/jpeg' });

  describe('readImageMetaTags()', () => {
    it('should use PNG parser on PNG file', async () => {
      const metaData = await readImageMetaTags(pngFile);
      expect(readPNGXMPMetaData).toBeCalledWith(pngFile);
      expect(parseXMPMetaData).toBeCalled();
      expect(metaData).toEqual(mockXMPMetaData);
    });

    it('should use JPEG parser on JPEG file', async () => {
      const metaData = await readImageMetaTags(jpegFile);
      expect(readJPEGExifMetaData).toBeCalledWith(jpegFile);
      expect(metaData).toEqual('jpgMetaData');
    });

    it('should return null if JPEG parsing causes error', async () => {
      readJPEGExifMetaData.mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(jpegFile);
      expect(metaData).toBeNull();
    });

    it('should return null if PNG parsing causes error', async () => {
      readPNGXMPMetaData.mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(pngFile);
      expect(metaData).toBeNull();
    });
  });
});
