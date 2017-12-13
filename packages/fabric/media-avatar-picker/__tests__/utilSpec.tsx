import { dataURItoFile, fileToDataURI } from '../src/util';
import { tallImage } from '@atlaskit/media-test-helpers';

describe('dataURItoFile, fileToDataURI Util', () => {
  const tallImageFile = dataURItoFile(tallImage);

  it('should convert dataURI to File', () => {
    expect(tallImageFile).toBeInstanceOf(File);
  });

  it('should convert File to dataURI', async () => {
    const dataURI = await fileToDataURI(tallImageFile);
    expect(dataURI).toBe(tallImage);
  });
});
