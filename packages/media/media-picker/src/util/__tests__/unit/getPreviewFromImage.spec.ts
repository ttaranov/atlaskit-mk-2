import { getFileInfo } from '@atlaskit/media-ui';

const getImageInfo = jest.fn().mockReturnValue({
  width: 1,
  height: 2,
  scaleFactor: 3,
});

jest.mock('@atlaskit/media-ui', () => ({
  getImageInfo,
  getFileInfo,
}));

import { getPreviewFromImage } from '../../getPreviewFromImage';
import { ImagePreview, Preview } from '../../../domain/preview';

describe('getPreviewFromImage()', () => {
  const file = new File([], 'some-filename');

  it('should get imagepreview from file', async () => {
    const preview = (await getPreviewFromImage(file)) as ImagePreview;
    expect(getImageInfo).toBeCalled();
    expect(preview.dimensions.width).toBe(1);
    expect(preview.dimensions.height).toBe(2);
    expect(preview.scaleFactor).toBe(3);
  });

  it('should not get imagepreview from invalid file', async () => {
    getImageInfo.mockReturnValue(null);
    const preview = (await getPreviewFromImage(file)) as Preview;
    expect(preview.file).toBe(file);
    expect(preview).not.toHaveProperty('dimensions');
    expect(preview).not.toHaveProperty('scaleFactor');
  });
});
