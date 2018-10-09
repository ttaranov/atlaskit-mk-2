const readImageMetaTags = jest
  .fn()
  .mockReturnValue({ Orientation: 'top-right' });
const loadImage = jest
  .fn()
  .mockReturnValue({ naturalWidth: 1, naturalHeight: 2 });

import { getFileInfo } from '../../util';
jest.mock('../../imageMetaData/metatags', () => ({ readImageMetaTags }));
jest.mock('../../util', () => ({ getFileInfo, loadImage }));

import {
  getImageInfo,
  getOrientation,
  getMetaTagNumericValue,
  getScaleFactorFromFile,
  readImageMetaData,
  ImageMetaData,
  ImageMetaDataTags,
  ImageInfo,
} from '../../imageMetaData';

import { ExifOrientation } from '../../imageMetaData/types';

describe('Image Meta Data', () => {
  const fileInfo = {
    file: new File([], 'some-file', { type: 'image/png' }),
    src: 'some-src',
  };

  describe('getImageInfo()', () => {
    it('should return image info from valid file', async () => {
      const imageInfo = await getImageInfo(fileInfo);
      expect(imageInfo).toEqual(
        expect.objectContaining({
          scaleFactor: 1,
          width: 1,
          height: 2,
        }),
      );
    });

    it('should use scaleFactor from filename', async () => {
      const imageInfo = (await getImageInfo({
        file: new File([], 'some-file@2x.png', { type: 'image/png' }),
        src: 'some-src',
      })) as ImageInfo;
      expect(imageInfo.scaleFactor).toBe(2);
    });

    it('should return null when images fail to load', async () => {
      loadImage.mockImplementation(() => {
        throw new Error();
      });
      const imageInfo = await getImageInfo(fileInfo);
      expect(imageInfo).toBeNull();
    });
  });

  describe('getOrientation()', () => {
    const file = new File([], 'some-filename');

    it('should return orientation from metatags using strings', async () => {
      const orientation = await getOrientation(file);
      expect(readImageMetaTags).toBeCalled();
      expect(orientation).toBe(ExifOrientation['top-right']);
    });

    it('should return orientation from metatags using numbers', async () => {
      readImageMetaTags.mockReturnValue({ Orientation: '6' });
      const orientation = await getOrientation(file);
      expect(orientation).toBe(6);
    });

    it('should return 1="top-left" (default) when cannot read orientation from metatags', async () => {
      readImageMetaTags.mockReturnValue({});
      const orientation = await getOrientation(file);
      expect(readImageMetaTags).toBeCalled();
      expect(orientation).toBe(ExifOrientation['top-left']);
    });
  });

  describe('getMetaTagNumericValue()', () => {
    it('should parse numeric values from metatags', () => {
      expect(getMetaTagNumericValue({ A: '2' }, 'A', 1)).toBe(2);
    });

    it('should return default value when not found in metatags', () => {
      expect(getMetaTagNumericValue({}, 'A', 1)).toBe(1);
    });

    it('should return default value cannot parse metatags', () => {
      expect(getMetaTagNumericValue({ A: 'xyz' }, 'A', 1)).toBe(1);
    });
  });

  describe('getScaleFactorFromFile()', () => {
    it('should detect scaleFactor from filename with correct pattern', () => {
      const file = new File([], 'filename@2x.png');
      expect(getScaleFactorFromFile(file)).toBe(2);
    });

    it('should not detect scaleFactor from filename with incorrect pattern', () => {
      const file = new File([], 'filename@x2.png');
      expect(getScaleFactorFromFile(file)).toBe(null);
    });

    it('should find floating values from one decimal', () => {
      const file = new File([], 'filename@2.3x.png');
      expect(getScaleFactorFromFile(file)).toBe(2.3);
    });

    it('should find reasonable floating values from multiple decimals', () => {
      const file = new File([], 'filename@2.3.4x.png');
      expect(getScaleFactorFromFile(file)).toBe(2.3);
    });
  });

  describe('readImageMetaData()', () => {
    it('should read image metadata properties from file info', async () => {
      loadImage.mockReturnValue({
        naturalWidth: 1,
        naturalHeight: 2,
      });
      readImageMetaTags.mockReturnValue({ Orientation: 'top-left' });
      const imageMetaData = (await readImageMetaData(
        fileInfo,
      )) as ImageMetaData;
      expect(imageMetaData.type).toBe('image/png');
      expect(imageMetaData.width).toBe(1);
      expect(imageMetaData.height).toBe(2);
      expect((imageMetaData.tags as ImageMetaDataTags).Orientation).toBe(
        'top-left',
      );
    });

    it('should return null when images fail to load', async () => {
      loadImage.mockImplementation(() => {
        throw new Error();
      });
      const imageMetaData = await readImageMetaData(fileInfo);
      expect(imageMetaData).toBeNull();
    });
  });
});
