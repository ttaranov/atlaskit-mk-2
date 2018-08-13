// TODO this test goes away as part of MSW-691
import * as sinon from 'sinon';

import { AuthProvider } from '@atlaskit/media-core';
import { MediaApi } from '../mediaApi';
import { MediaClient } from '../mediaClient';
import * as promises from '../../util/promises';
import { Task } from '../../util/promises';
import { SourceFile } from '../../popup/domain';

// Function for tests to retry without waiting
function retry<T>(
  task: Task<T>,
  numRetries: number,
  delay: number,
  delayMultiplier: number,
): Promise<T> {
  const chainPromise = (
    t: Task<T>,
    resolve: (t: T) => void,
    reject: (error: Error) => void,
    retriesLeft: number,
  ): Promise<void> => {
    if (retriesLeft <= 1) {
      return t()
        .then(resolve)
        .catch(reject);
    }

    return t()
      .then(resolve)
      .catch(() => chainPromise(task, resolve, reject, retriesLeft - 1));
  };

  return new Promise((resolve, reject) => {
    chainPromise(task, resolve, reject, numRetries);
  });
}

describe('Api', () => {
  const baseUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const authProvider: AuthProvider = () =>
    Promise.resolve({ clientId, token, baseUrl });

  describe('createUpload', () => {
    const uploadId = 'some-upload-id';

    let mediaClient: MediaClient;
    let callStub: sinon.SinonStub;
    let retryTaskStub: sinon.SinonStub;
    let api: MediaApi;

    beforeEach(() => {
      mediaClient = new MediaClient(authProvider);
      callStub = sinon.stub(mediaClient, 'call');
      api = new MediaApi();

      retryTaskStub = sinon.stub(promises, 'retryTask').callsFake(retry);
    });

    afterEach(() => {
      retryTaskStub.restore();
    });

    it('should reject if mediaClient rejects the request', done => {
      const error = new Error('No network connection');
      callStub.rejects(error);

      api.createUpload(mediaClient).catch(receivedError => {
        expect(receivedError).toEqual(error);
        done();
      });
    });

    it('should return uploadId if mediaClient successfully completes the request', () => {
      callStub
        .withArgs({
          httpMethod: 'POST',
          mediaApiMethod: 'upload',
          parameters: {
            createUpTo: 1,
            safariCacheBuster: sinon.match.any,
          },
        })
        .resolves({ data: [{ id: uploadId }] });

      return api.createUpload(mediaClient).then(id => {
        expect(id).toEqual(uploadId);
      });
    });

    it('should return uploadId if mediaClient returns a non-empty array only at second attempt', () => {
      callStub.onCall(0).resolves({ data: [] });
      callStub.onCall(1).resolves({ data: [{ id: uploadId }] });

      return api.createUpload(mediaClient).then(id => {
        expect(id).toEqual(uploadId);
      });
    });

    it('should return uploadId if mediaClient successfully completes the request on the fifth attempt', () => {
      callStub.onCall(0).rejects(new Error('No connection'));
      callStub.onCall(1).resolves({ data: [] });
      callStub.onCall(2).rejects(new Error('No connection'));
      callStub.onCall(3).rejects(new Error('No connection'));
      callStub.onCall(4).resolves({ data: [{ id: uploadId }] });

      return api.createUpload(mediaClient).then(id => {
        expect(id).toEqual(uploadId);
      });
    });
  });

  describe('appendChunksToUpload', () => {
    const uploadId = 'some-upload-id';
    const chunkIds = ['1', '2', '3'];
    const offset = 123;

    let mediaClient: MediaClient;
    let callStub: sinon.SinonStub;
    let api: MediaApi;

    beforeEach(() => {
      mediaClient = new MediaClient(authProvider);
      callStub = sinon.stub(mediaClient, 'call');
      api = new MediaApi();
    });

    it('should resolve if the client resolves the call', () => {
      callStub
        .withArgs({
          httpMethod: 'PUT',
          mediaApiMethod: `upload/${uploadId}/chunks`,
          data: {
            chunks: chunkIds,
            offset,
          },
        })
        .resolves({ data: {} });

      return api.appendChunksToUpload(mediaClient, uploadId, chunkIds, offset);
    });

    it('should reject if the client rejects the call', done => {
      const error = new Error('No network connection');
      callStub.rejects(error);

      api
        .appendChunksToUpload(mediaClient, uploadId, chunkIds, offset)
        .catch(receivedError => {
          expect(receivedError).toEqual(error);
          done();
        });
    });
  });

  describe('createFileFromUpload', () => {
    const uploadId = 'some-upload-id';
    const fileId = 'some-file-id';
    const fileName = 'some-file-name';
    const mimeType = 'some-mime-type';
    const collection = 'some-collection';

    let mediaClient: MediaClient;
    let callStub: sinon.SinonStub;
    let api: MediaApi;

    beforeEach(() => {
      mediaClient = new MediaClient(authProvider);
      callStub = sinon.stub(mediaClient, 'call');
      api = new MediaApi();
    });

    it('should resolve if the client resolves the call, collection not included', () => {
      callStub
        .withArgs({
          httpMethod: 'POST',
          mediaApiMethod: 'file/upload',
          parameters: {},
          data: {
            name: fileName,
            mimeType,
            uploadId,
          },
        })
        .resolves({ data: { id: fileId } });

      return api
        .createFileFromUpload(mediaClient, fileName, mimeType, uploadId)
        .then(returnedFileId => {
          expect(returnedFileId).toEqual(fileId);
        });
    });

    it('should resolve if the client resolves the call, collection included', () => {
      callStub
        .withArgs({
          httpMethod: 'POST',
          mediaApiMethod: 'file/upload',
          parameters: { collection },
          data: {
            name: fileName,
            mimeType,
            uploadId,
          },
        })
        .resolves({ data: { id: fileId } });

      return api
        .createFileFromUpload(
          mediaClient,
          fileName,
          mimeType,
          uploadId,
          collection,
        )
        .then(returnedFileId => {
          expect(returnedFileId).toEqual(fileId);
        });
    });

    it('should reject if the client rejects the call', done => {
      const error = new Error('No network connection');
      callStub.rejects(error);

      api
        .createFileFromUpload(
          mediaClient,
          fileName,
          mimeType,
          uploadId,
          collection,
        )
        .catch(receivedError => {
          expect(receivedError).toEqual(error);
          done();
        });
    });
  });

  describe('pollFile', () => {
    const fileId = 'some-file-id';
    const collection = 'some-collection';

    let mediaClient: MediaClient;
    let callStub: sinon.SinonStub;
    let retryTaskStub: sinon.SinonStub;
    let api: MediaApi;

    beforeEach(() => {
      mediaClient = new MediaClient(authProvider);
      callStub = sinon.stub(mediaClient, 'call');
      api = new MediaApi();

      retryTaskStub = sinon.stub(promises, 'retryTask').callsFake(retry);
    });

    afterEach(() => {
      retryTaskStub.restore();
    });

    it('should resolve if the client resolves the call with "succeeded" processing status, collection not included', () => {
      const metadata = {
        processingStatus: 'succeeded',
        id: fileId,
      };

      callStub
        .withArgs({
          httpMethod: 'GET',
          mediaApiMethod: `file/${fileId}`,
          parameters: {},
        })
        .resolves({ data: metadata });

      return api
        .pollForFileMetadata(mediaClient, fileId, undefined)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should resolve if the client resolves the call with "succeeded" processing status, collection included', () => {
      const metadata = {
        processingStatus: 'succeeded',
        id: fileId,
      };

      callStub
        .withArgs({
          httpMethod: 'GET',
          mediaApiMethod: `file/${fileId}`,
          parameters: { collection },
        })
        .resolves({ data: metadata });

      return api
        .pollForFileMetadata(mediaClient, fileId, collection)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should resolve if the client resolves the call with "failed" processing status, collection not included', () => {
      const metadata = {
        processingStatus: 'failed',
        id: fileId,
      };

      callStub
        .withArgs({
          httpMethod: 'GET',
          mediaApiMethod: `file/${fileId}`,
          parameters: {},
        })
        .resolves({ data: metadata });

      return api
        .pollForFileMetadata(mediaClient, fileId, undefined)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should resolve if the client resolves the call with "failed" processing status, collection included', () => {
      const metadata = {
        processingStatus: 'failed',
        id: fileId,
      };

      callStub
        .withArgs({
          httpMethod: 'GET',
          mediaApiMethod: `file/${fileId}`,
          parameters: { collection },
        })
        .resolves({ data: metadata });

      return api
        .pollForFileMetadata(mediaClient, fileId, collection)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should resolve with metadata if the client firstly responds with processing status "pending" and then "succeeded"', () => {
      const metadata = {
        processingStatus: 'succeeded',
        id: fileId,
      };

      callStub.onCall(0).resolves({ data: { processingStatus: 'pending' } });
      callStub
        .onCall(1)
        .resolves({ data: { processingStatus: 'succeeded', id: fileId } });

      return api
        .pollForFileMetadata(mediaClient, fileId, collection)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should resolve metadata if the client responds with processing status "succeeded" only from the 10th attempt', () => {
      const metadata = {
        processingStatus: 'succeeded',
        id: fileId,
      };

      callStub.onCall(0).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(1).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(2).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(3).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(4).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(5).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(6).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(7).resolves({ data: { processingStatus: 'pending' } });
      callStub.onCall(8).resolves({ data: { processingStatus: 'pending' } });
      callStub
        .onCall(9)
        .resolves({ data: { processingStatus: 'succeeded', id: fileId } });

      return api
        .pollForFileMetadata(mediaClient, fileId, collection)
        .then(receivedMetadata => {
          expect(receivedMetadata).toEqual(metadata);
        });
    });

    it('should reject if the client always rejects the call', done => {
      const error = new Error('No network connection');
      callStub.rejects(error);

      api
        .pollForFileMetadata(mediaClient, fileId, collection)
        .catch(receivedError => {
          expect(receivedError).toEqual(error);
          done();
        });
    });
  });

  describe('copyFileToCollection()', () => {
    it('should invoke mediaClient.call() with correct request object', () => {
      const mediaClient = {
        call: jest.fn().mockReturnValue(Promise.resolve()),
      } as any;
      const sourceFile: SourceFile = {
        id: 'some-source-file-id',
        owner: {
          id: 'some-owner-client-id',
          token: 'some-owner-client-token',
          baseUrl,
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
      const sourceFile: SourceFile = {
        id: 'some-source-file-id',
        owner: {
          id: 'some-owner-client-id',
          token: 'some-owner-client-token',
          baseUrl,
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
