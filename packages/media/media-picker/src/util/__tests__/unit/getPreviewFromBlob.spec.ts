import { getPreviewFromBlob } from '../../getPreviewFromBlob';
import { dataURItoFile } from '@atlaskit/media-ui';

const tinyPngDataURI = 'data:image/png};base64,';

describe('getPreviewFromBlob', () => {
  const file = dataURItoFile(tinyPngDataURI);

  it('should not mutate passed File', async () => {
    expect(file).not.toHaveProperty('__base64Str');
    await getPreviewFromBlob(file, 'image');
    expect(file).not.toHaveProperty('__base64Str');
  });
});
