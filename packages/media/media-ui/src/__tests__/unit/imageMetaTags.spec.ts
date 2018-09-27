const readJPEGExifMetaData = jest.fn().mockReturnValue('jpgMetaData');
const readPNGXMPMetaData = jest.fn().mockReturnValue('pngMetaData');
const parseXMPMetaData = jest.fn().mockReturnValue('pngXMPMetaData');
const mockImage = {};
const loadImage = jest.fn().mockReturnValue(Promise.resolve(mockImage));

jest.mock('../../imageMetaData/parseJPEG', () => ({ readJPEGExifMetaData }));
jest.mock('../../imageMetaData/parsePNG', () => ({ readPNGXMPMetaData }));
jest.mock('../../imageMetaData/parsePNGXMP', () => ({ parseXMPMetaData }));
jest.mock('../../util', () => ({ loadImage }));

import { readImageMetaTags } from '../../imageMetaData/metatags';

describe('Image Meta Tags', () => {
  const pngFile = new File([], 'filename.png', { type: 'image/png' });
  const jpegFile = new File([], 'filename.jpeg', { type: 'image/jpeg' });

  describe('readImageMetaTags()', () => {
    it('should use PNG parser on PNG file', async () => {
      const fileInfo = {
        file: pngFile,
        src: 'some-src',
      };
      const metaData = await readImageMetaTags(fileInfo);
      expect(readPNGXMPMetaData).toBeCalledWith(pngFile);
      expect(parseXMPMetaData).toBeCalled();
      expect(metaData).toEqual('pngXMPMetaData');
    });

    it('should use JPEG parser on JPEG file', async () => {
      const fileInfo = {
        file: jpegFile,
        src: 'some-src',
      };
      const metaData = await readImageMetaTags(fileInfo);
      expect(loadImage).toBeCalled();
      expect(readJPEGExifMetaData).toBeCalledWith(jpegFile);
      expect(metaData).toEqual('jpgMetaData');
    });
  });
});
