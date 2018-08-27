import { useFakeXMLHttpRequest } from 'sinon';
import { LRUCache } from 'lru-fast';
import { Auth, AuthProvider } from '@atlaskit/media-store';

import { MediaFileService } from '../../services/fileService';
import { FileDetails, FileItem } from '../../item';

const baseUrl = 'some-host';
const token = 'some-token';

const fileId = 'some-file-id';
const unprocessedFileId = 'some-unprocessed-file-id';
const clientId = 'some-client-id';
const collection = 'some-collection';
const authParams = `token=${token}&client=${clientId}`;
const defaultFileDetails = {
  id: 'some-file-id',
  mediaType: 'image',
  mimeType: 'some-mime-type',
  name: 'some-name',
  processingStatus: 'succeeded',
  size: 12345,
  artifacts: {
    'document.pdf': { href: `/file/${fileId}/artifact/document.pdf` },
    'presentation.ppt': { href: `/file/${fileId}/artifact/presentation.ppt` },
  },
};

describe('MediaFileService', () => {
  let fileService: MediaFileService;

  let xhr: any;
  let requests: Array<any>;
  let authProvider: AuthProvider;

  const setupFakeXhr = () => {
    xhr = useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function(xhr: any) {
      requests.push(xhr);
    };
  };

  const respondFakeXhr = (fileDetails?: FileDetails) => {
    setTimeout(() => {
      const mockedResponse = {
        data: fileDetails || defaultFileDetails,
      };
      if (requests[0]) {
        requests[0].respond(
          200,
          { 'Content-Type': 'application/json' },
          JSON.stringify(mockedResponse),
        );
      }
    });
  };

  const resetAuthProvider = () => {
    authProvider = jest.fn(() =>
      Promise.resolve<Auth>({
        token,
        clientId,
        baseUrl,
      }),
    );
  };

  beforeEach(() => {
    setupFakeXhr();
    const cache = new LRUCache<string, FileItem>(0);
    resetAuthProvider();
    fileService = new MediaFileService({ authProvider }, cache);
  });

  afterEach(function() {
    xhr.restore();
  });

  it('should resolve file item from collection given or not', () => {
    respondFakeXhr();
    return fileService
      .getFileItem(fileId, collection)
      .then(fileItem => {
        expect(fileItem.type).toBe('file');
        expect(fileItem.details).toEqual(defaultFileDetails);
      })
      .then(() => {
        // Validate call to token provider
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: collection,
        });
      })
      .then(() => {
        expect(requests[0].url).toBe(
          `some-host/file/some-file-id?collection=some-collection&${authParams}`,
        );
      });
  });

  it('should resolve file item from collection given', () => {
    const response = fileService
      .getFileItem(fileId)
      .then(fileItem => {
        expect(fileItem.type).toBe('file');
        expect(fileItem.details).toEqual(defaultFileDetails);
      })
      .then(() => {
        // Validate call to token provider
        expect(authProvider).toHaveBeenCalledWith({
          collectionName: undefined,
        });
      })
      .then(() => {
        expect(requests[0].url).toBe(
          `some-host/file/some-file-id?${authParams}`,
        );
      });

    respondFakeXhr();

    return response;
  });

  it('should reject server responded with 500', () => {
    const response = fileService
      .getFileItem('some-dodgy-file-id', collection)
      .then(
        () => {
          throw new Error('The function getFileItem should fail');
        },
        error => expect(error).toBeDefined(),
      );

    setTimeout(() => {
      requests[0].respond(500, {}, '');
    });
    return response;
  });

  describe('cache', () => {
    const shouldReturnFileFromService = (
      id: string,
      cache: LRUCache<string, FileItem>,
      fileDetails?: FileDetails,
    ) => {
      resetAuthProvider();
      fileService = new MediaFileService({ authProvider }, cache);
      respondFakeXhr(fileDetails);
      return fileService.getFileItem(id, collection).then(() => {
        expect(authProvider).toHaveBeenCalledTimes(1);
      });
    };

    const shouldReturnFileFromCache = (
      id: string,
      cache: LRUCache<string, FileItem>,
    ) => {
      resetAuthProvider();
      fileService = new MediaFileService({ authProvider }, cache);
      return fileService.getFileItem(id, collection).then(() => {
        expect(authProvider).not.toHaveBeenCalled();
      });
    };

    it('should cache processed files', () => {
      const cache = new LRUCache<string, FileItem>(1);
      return shouldReturnFileFromService(fileId, cache).then(() =>
        shouldReturnFileFromCache(fileId, cache),
      );
    });

    it('should not cache processed files if caching is disabled', () => {
      const cache = new LRUCache<string, FileItem>(0);
      return shouldReturnFileFromService(fileId, cache).then(() => {
        xhr.restore();
        setupFakeXhr();
        return shouldReturnFileFromService(fileId, cache);
      });
    });

    it('should not cache unprocessed files', () => {
      const unprocessedFileDetails: FileDetails = {
        id: 'some-file-id',
        mediaType: 'image',
        mimeType: 'some-mime-type',
        name: 'some-name',
        processingStatus: 'pending',
        size: 12345,
        artifacts: {
          'document.pdf': {
            url: `/file/${fileId}/artifact/document.pdf`,
            processingStatus: 'pending',
          },
          'presentation.ppt': {
            url: `/file/${fileId}/artifact/presentation.ppt`,
            processingStatus: 'pending',
          },
        },
      };
      const cache = new LRUCache<string, FileItem>(1);
      return shouldReturnFileFromService(
        unprocessedFileId,
        cache,
        unprocessedFileDetails,
      ).then(() => {
        xhr.restore();
        setupFakeXhr();
        return shouldReturnFileFromService(
          unprocessedFileId,
          cache,
          unprocessedFileDetails,
        );
      });
    });
  });
});
