jest.mock('../../../../../src/util/getPreview');

import { Service } from '../../../domain';
import { isImagePreview } from '../../../../../src/domain/preview';
import { flattenAccounts, MediaApiFetcher } from '../fetcher';
import getPreviewFromBlob from '../../../../../src/util/getPreview';

describe('Fetcher', () => {
  const apiUrl = 'api-url';
  const auth = {
    clientId: '',
    token: '',
  };
  const fileId = 'file-id';
  const imageFile = {
    mediaType: 'image',
  };
  const nonImageFile = {
    mediaType: 'unknown',
  };
  let fetcher = new MediaApiFetcher();
  let querySpy = jest.fn();

  beforeEach(() => {
    fetcher = new MediaApiFetcher();
    querySpy = jest.fn();

    querySpy.mockReturnValue(Promise.resolve({}));
  });

  describe('getPreview()', () => {
    it('should call api with biggest supported dimensions for image files', () => {
      fetcher['query'] = querySpy;
      fetcher.pollFile = jest.fn().mockReturnValue(Promise.resolve(imageFile));
      return fetcher.getPreview(apiUrl, auth, fileId).then(() => {
        expect(querySpy.mock.calls[0][2]).toEqual(
          expect.objectContaining({
            width: 4096,
            height: 4096,
          }),
        );
      });
    });

    it('should call api with default dimensions for non image files', () => {
      fetcher['query'] = querySpy;
      fetcher.pollFile = jest
        .fn()
        .mockReturnValue(Promise.resolve(nonImageFile));
      return fetcher.getPreview(apiUrl, auth, fileId).then(() => {
        expect(querySpy.mock.calls[0][2]).toEqual(
          expect.objectContaining({
            width: 640,
            height: 480,
          }),
        );
      });
    });
  });

  describe('getImagePreview()', () => {
    it('should return a valid image preview', () => {
      (getPreviewFromBlob as jest.Mock<void>).mockReturnValue({
        dimensions: {
          width: 100,
          height: 100,
        },
      });
      fetcher['query'] = querySpy;
      fetcher.pollFile = jest.fn().mockReturnValue(Promise.resolve(imageFile));
      return fetcher.getPreview(apiUrl, auth, fileId).then(preview => {
        if (!isImagePreview(preview)) {
          return Promise.reject('no preview returned');
        }

        expect(preview.dimensions).toEqual({
          width: 100,
          height: 100,
        });
      });
    });
  });

  describe('flattenAccounts()', () => {
    const services: Service[] = [
      {
        type: 'dropbox',
        status: 'available',
        accounts: [
          {
            id: 'dropbox|111111111',
            status: 'available',
            displayName: 'user@atlassian.com',
          },
        ],
      },
      {
        type: 'google',
        status: 'available',
        accounts: [],
      },
    ];

    it('flattens the response data into a list of accounts', () => {
      const flattened = flattenAccounts(services);
      expect(flattened).toEqual([
        {
          id: 'dropbox|111111111',
          status: 'available',
          displayName: 'user@atlassian.com',
          type: 'dropbox',
        },
      ]);
    });
  });
});
