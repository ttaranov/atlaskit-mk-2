import { MediaBlobService } from '../../blobService';
import { AuthProvider } from '@atlaskit/media-store';

const clientId = 'some-client-id';
const collectionName = 'some-collection-name';
const token = 'some-token';
const baseUrl = 'some-service-host';

function createFetchSomeBlobSpy() {
  return jest.fn(() => ({
    response: Promise.resolve(new Blob()),
    cancel: jest.fn(),
  }));
}

describe('MediaBlobService', () => {
  const authProvider: AuthProvider = () =>
    Promise.resolve({
      token,
      clientId,
      baseUrl,
    });
  const service = new MediaBlobService(authProvider, collectionName);

  describe('fetchImageBlob()', () => {
    it('should allow animation by default', () => {
      const fetchSomeBlobSpy = createFetchSomeBlobSpy();
      service.fetchSomeBlob = fetchSomeBlobSpy;

      service.fetchImageBlob(
        { type: 'file', details: { id: 'id' } },
        { width: 100, height: 100 },
      );

      let params = fetchSomeBlobSpy.mock.calls[0][1];
      expect(params.allowAnimated).toBe(true);
    });

    it('should allow consumers to disallow animation', () => {
      const fetchSomeBlobSpy = createFetchSomeBlobSpy();
      service.fetchSomeBlob = fetchSomeBlobSpy;

      service.fetchImageBlob(
        { type: 'file', details: { id: 'id' } },
        {
          width: 100,
          height: 100,
          allowAnimated: false,
        },
      );

      let params = fetchSomeBlobSpy.mock.calls[0][1];
      expect(params.allowAnimated).toBe(false);
    });

    it('should use "crop" resize mode as default', () => {
      const fetchSomeBlobSpy = createFetchSomeBlobSpy();
      service.fetchSomeBlob = fetchSomeBlobSpy;

      service.fetchImageBlob(
        { type: 'file', details: { id: 'id' } },
        { width: 100, height: 100 },
      );

      expect(fetchSomeBlobSpy.mock.calls[0][1].mode).toBe('crop');
    });

    it('should allow consumers to specify a resize mode', () => {
      const fetchSomeBlobSpy = createFetchSomeBlobSpy();
      service.fetchSomeBlob = fetchSomeBlobSpy;

      service.fetchImageBlob(
        { type: 'file', details: { id: 'id' } },
        {
          width: 100,
          height: 100,
          mode: 'full-fit',
        },
      );

      expect(fetchSomeBlobSpy.mock.calls[0][1].mode).toBe('full-fit');
    });
  });
});
