declare var global: any;

class MockFileReader {
  loadEvent: () => void = () => {};
  errorEvent: ({}) => void = () => {};
  result: string | null | ArrayBuffer;

  constructor(result: string | null | ArrayBuffer = 'mockResult') {
    this.result = result;
  }

  addEventListener = jest
    .fn()
    .mockImplementation((eventName: string, fn: () => void): void => {
      if (eventName === 'load') {
        this.loadEvent = fn;
      } else if (eventName === 'error') {
        this.errorEvent = fn;
      }
    });

  readAsDataURL = jest.fn().mockImplementation((): void => {
    this.loadEvent();
  });

  readAsArrayBuffer = jest.fn().mockImplementation((): void => {
    this.loadEvent();
  });
}

const mockFileReaderError = { message: 'error' };

class MockFileReaderWithError extends MockFileReader {
  readAsDataURL = jest.fn().mockImplementation((): void => {
    this.errorEvent(mockFileReaderError);
  });
}

const GloblFileReader = global.FileReader;

const FileReader = jest
  .spyOn(global, 'FileReader')
  .mockImplementation(() => new GloblFileReader());

const mockFileReader = (result: string | null | ArrayBuffer) => {
  const fileReader = new MockFileReader(result);
  FileReader.mockImplementation(() => fileReader);
  return fileReader;
};

const mockFileReaderWithError = () => {
  const fileReader = new MockFileReaderWithError();
  FileReader.mockImplementation(() => fileReader);
  return fileReader;
};

const unmockFileReader = () =>
  FileReader.mockImplementation(() => new GloblFileReader());

export {
  mockFileReader,
  mockFileReaderWithError,
  unmockFileReader,
  mockFileReaderError,
};
