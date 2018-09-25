const getData = jest.fn((_img: any, fn: any) => {
  fn();
});
const getAllTags = jest.fn(() => {
  return {
    Orientation: 1,
    XResolution: {
      numerator: 2,
      denominator: 3,
    },
    YResolution: {
      numerator: 4,
      denominator: 5,
    },
    ResolutionUnit: 6,
    Software: 'Pixelmator 3.7.4',
    DateTime: '2018:09:18 13:09:09',
    ExifIFDPointer: 7,
    ColorSpace: 8,
    PixelXDimension: 9,
    PixelYDimension: 10,
    thumbnail: {},
  };
});

jest.mock('exif-js', () => ({
  getData,
  getAllTags,
}));

import { readJPEGExifMetaData } from '../../imageMetaData/parseJPEG';

describe('Image Meta Data JPEG parsing', () => {
  describe('readJPEGExifMetaData()', () => {
    it('should convert numeric values to string', async () => {
      const tags = await readJPEGExifMetaData(new Image());
      Object.keys(tags).forEach(key =>
        expect(typeof tags[key]).not.toBe('number'),
      );
    });

    it('should convert numerator/denominator values to single numerator', async () => {
      const tags = await readJPEGExifMetaData(new Image());
      expect(tags.XResolution).toBe('2');
      expect(tags.YResolution).toBe('4');
    });
  });
});
