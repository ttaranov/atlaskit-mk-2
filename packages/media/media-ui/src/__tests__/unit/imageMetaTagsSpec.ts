const readJPEGExifMetaData = jest.fn();
const readPNGXMPMetaData = jest.fn().mockReturnValue('pngMetaData');
const parseXMPMetaData = jest.fn().mockReturnValue('pngXMPMetaData');
const mockImage = {};
const loadImage = jest.fn().mockReturnValue(Promise.resolve(mockImage));

import { dataURItoFile } from '../../util';

jest.mock('../../imageMetaData/parseJPEG', () => ({ readJPEGExifMetaData }));
jest.mock('../../imageMetaData/parsePNG', () => ({ readPNGXMPMetaData }));
jest.mock('../../imageMetaData/parsePNGXMP', () => ({ parseXMPMetaData }));
jest.mock('../../util', () => ({ loadImage }));

import { readImageMetaTags } from '../../imageMetaData/metatags';
import { smallPngDataURI, smallJPEGDataURI } from './imageHelpers';

describe('Image Meta Tags', () => {
  const pngFile = dataURItoFile(smallPngDataURI);
  const jpegFile = dataURItoFile(smallJPEGDataURI);

  describe('readImageMetaTags()', () => {
    it('should use PNG parser on PNG file', async () => {
      const fileInfo = {
        file: pngFile,
        src: smallPngDataURI,
      };
      await readImageMetaTags(fileInfo);
      expect(readPNGXMPMetaData).toBeCalledWith(pngFile);
      expect(parseXMPMetaData).toBeCalled();
    });

    it('should use JPEG parser on JPEG file', async () => {
      const fileInfo = {
        file: jpegFile,
        src: smallJPEGDataURI,
      };
      await readImageMetaTags(fileInfo);
      expect(loadImage).toBeCalled();
      expect(readJPEGExifMetaData).toBeCalledWith(jpegFile);
    });
  });
});
