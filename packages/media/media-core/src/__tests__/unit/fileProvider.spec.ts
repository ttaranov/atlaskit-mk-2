import { FileProvider } from '../../providers/fileProvider';

const fileId = 'some-file-id';
const collection = 'some-collection';
const succeededFileItem = {
  type: 'file',
  details: {
    id: fileId,
    processingStatus: 'succeeded',
  },
};
const pendingFileItem = {
  type: 'file',
  details: {
    id: fileId,
    processingStatus: 'pending',
  },
};
const mockObserver = () => {
  return {
    next: jest.fn(),
    complete: jest.fn(),
    error: jest.fn(),
  };
};

describe('FileProvider', () => {
  it('should complete given file that succeeds immediately', () => {
    const fileService = Mocks.fileServiceSucceeded();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();
    const observer = mockObserver();

    fileProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        complete: () => {
          try {
            expect(observer.next.mock.calls[0][0]).toBe(succeededFileItem);
            expect(observer.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer.error).not.toHaveBeenCalled();
          } catch (err) {
            reject(err);
            return;
          }
          resolve();
        },
      });
    });
  });

  it('should next partial items given file that succeeds in future', () => {
    const fileService = Mocks.fileServicePendingBeforeSucceeded();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();
    const observer = mockObserver();

    fileProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        complete: () => {
          try {
            expect(observer.next.mock.calls[0][0]).toBe(pendingFileItem);
            expect(observer.next.mock.calls[1][0]).toBe(succeededFileItem);
            expect(observer.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer.error).not.toHaveBeenCalled();
          } catch (err) {
            reject(err);
            return;
          }
          resolve();
        },
      });
    });
  });

  it('should error given file service rejects', () => {
    const fileService = Mocks.fileServiceError();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();
    const observer = mockObserver();

    fileProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        error: error => {
          try {
            expect(observer.next).not.toHaveBeenCalled();
            expect(observer.complete).not.toHaveBeenCalled();
            expect(observer.error.mock.calls[0][0]).toBe(error);
          } catch (err) {
            reject(err);
            return;
          }
          resolve();
        },
      });
    });
  });

  it('should call the service only once for multiple observers', () => {
    const fileService = Mocks.fileServiceSucceeded();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();

    const observer = mockObserver();
    const observer2 = mockObserver();

    fileProvider.subscribe(observer);
    fileProvider.subscribe(observer2);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        complete: () => {
          try {
            // observer 1
            expect(observer.next.mock.calls[0][0]).toBe(succeededFileItem);
            expect(observer.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer.error).not.toHaveBeenCalled();

            // observer 2
            expect(observer2.next.mock.calls[0][0]).toBe(succeededFileItem);
            expect(observer2.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer2.error).not.toHaveBeenCalled();

            expect(fileService.getFileItem).toHaveBeenCalledTimes(1);
          } catch (err) {
            reject(err);
            return;
          }

          resolve();
        },
      });
    });
  });

  it('should replay last file item after completion', () => {
    const fileService = Mocks.fileServiceSucceeded();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();

    const observer = mockObserver();

    fileProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        complete: () => {
          try {
            expect(observer.next.mock.calls[0][0]).toBe(succeededFileItem);
            expect(observer.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer.error).not.toHaveBeenCalled();
          } catch (err) {
            reject(err);
            return;
          }

          fileProvider.subscribe({
            next: fileItem => {
              try {
                expect(fileItem).toBe(succeededFileItem);
              } catch (err) {
                reject(err);
                return;
              }
              resolve();
            },
            error: error => reject(error),
          });
        },
      });
    });
  });

  it('should replay complete event after completion', () => {
    const fileService = Mocks.fileServiceSucceeded();
    const fileProvider = FileProvider.fromFileService(
      fileService,
      fileId,
      collection,
    ).observable();

    const observer = mockObserver();

    fileProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      fileProvider.subscribe({
        complete: () => {
          try {
            expect(observer.next.mock.calls[0][0]).toBe(succeededFileItem);
            expect(observer.complete.mock.calls[0][0]).toBe(undefined);
            expect(observer.error).not.toHaveBeenCalled();
          } catch (err) {
            reject(err);
            return;
          }

          fileProvider.subscribe({
            complete: () => resolve(),
            error: error => reject(error),
          });
        },
      });
    });
  });
});

class Mocks {
  public static fileServiceSucceeded() {
    const stub = jest.fn(() => Promise.resolve(succeededFileItem));
    return {
      getFileItem: stub,
    };
  }

  public static fileServicePendingBeforeSucceeded() {
    let callCount = 0;

    const stub = jest.fn(() => {
      callCount++;

      if (callCount === 1) {
        return Promise.resolve(pendingFileItem);
      } else if (callCount === 2) {
        return Promise.resolve(succeededFileItem);
      } else {
        return null;
      }
    });

    return {
      getFileItem: stub,
    };
  }

  public static fileServiceError() {
    return {
      getFileItem: jest.fn(() => Promise.reject(new Error('mock-error'))),
    };
  }
}
