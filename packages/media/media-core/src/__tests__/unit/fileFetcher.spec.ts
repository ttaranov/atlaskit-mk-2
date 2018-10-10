import { MediaStore } from '@atlaskit/media-store';
import { FileFetcher } from '../../file';

describe('FileFetcher', () => {
  const setup = () => {
    const mediaStore: MediaStore = {
      getFileBinaryURL: jest.fn(),
    } as any;
    const fileFetcher = new FileFetcher(mediaStore);

    return { fileFetcher, mediaStore };
  };

  describe('downloadBinary()', () => {
    const fileId = 'some-file-id';
    const collectionName = 'some-collection-name';
    const fileName = 'some-name';
    const binaryUrl = 'some-binary-url';
    let mediaStore: MediaStore;
    let appendChild: jest.SpyInstance<any>;

    beforeEach(() => {
      let setupData = setup();
      mediaStore = setupData.mediaStore;
      (mediaStore.getFileBinaryURL as jest.Mock<any>).mockReturnValue(
        binaryUrl,
      );
      appendChild = jest.spyOn(document.body, 'appendChild');
      setupData.fileFetcher.downloadBinary(fileId, fileName, collectionName);
    });

    it('should call getFileBinaryURL', () => {
      expect(mediaStore.getFileBinaryURL).toHaveBeenCalledWith(
        fileId,
        collectionName,
      );
    });

    it('should create a link', () => {
      const lastAppendCall =
        appendChild.mock.calls[appendChild.mock.calls.length - 1];
      const link = lastAppendCall[0] as HTMLAnchorElement;
      expect(link.download).toBe(fileName);
      expect(link.href).toBe(binaryUrl);
      expect(link.target).toBe('media-download-iframe');
    });

    it('should create iframe and open binary url in it', () => {
      const iframe = document.getElementById(
        'media-download-iframe',
      ) as HTMLIFrameElement;
      expect(iframe).toBeDefined();
    });
  });
});
