import { MediaApi } from '../mediaApi';

describe('Api', () => {
  describe('copyFileToCollection()', () => {
    it('should invoke mediaClient.call() with correct request object', () => {
      const mediaClient = {
        call: jest.fn().mockReturnValue(Promise.resolve()),
      } as any;
      const sourceFile = {
        id: 'some-source-file-id',
        owner: {
          id: 'some-owner-client-id',
          token: 'some-owner-client-token',
        },
      };
      const collection = 'some-target-collection-name';

      const api = new MediaApi();

      return api
        .copyFileToCollection(mediaClient, sourceFile, collection)
        .then(() => {
          expect(mediaClient.call).toHaveBeenCalledTimes(1);
          expect(mediaClient.call.mock.calls[0][0]).toEqual({
            httpMethod: 'POST',
            mediaApiMethod: 'file/copy/withToken',
            parameters: { collection },
            data: { sourceFile },
          });
        });
    });

    it('should reject if mediaClient.call() rejects', done => {
      const errorStub = 'some-error';
      const mediaClient = {
        call: jest.fn().mockReturnValue(Promise.reject(errorStub)),
      } as any;
      const sourceFile = {
        id: 'some-source-file-id',
        owner: {
          id: 'some-owner-client-id',
          token: 'some-owner-client-token',
        },
      };
      const collection = 'some-target-collection-name';

      const api = new MediaApi();

      return api
        .copyFileToCollection(mediaClient, sourceFile, collection)
        .catch(error => {
          expect(error).toEqual(errorStub);
          done();
        });
    });
  });
});
