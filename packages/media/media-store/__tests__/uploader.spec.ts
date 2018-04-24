jest.mock('chunkinator');
jest.mock('../src/media-store');

import chunkinator, { Options } from 'chunkinator';
import { MediaStore } from '../src/media-store';
import { uploadFile } from '../src';

describe('Uploader', () => {
  const setup = () => {
    const ChunkinatorMock = jest.fn();
    const config = {
      serviceHost: '',
      authProvider,
    };
    const createFileFromUpload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: '123' } }));
    const createUpload = () => {
      return Promise.resolve({ data: [{ id: 'upload-id-123' }] });
    };
    const appendChunksToUpload = jest.fn().mockReturnValue(Promise.resolve(1));
    const createFile = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: 'id-upfront-123' } }));
    const MediaStoreMock = jest.fn().mockImplementation(() => ({
      createFile,
      createUpload,
      createFileFromUpload,
      appendChunksToUpload,
    }));

    const blob: Blob = null as any;
    ChunkinatorMock.mockImplementation(
      async (_file, config: Options, callbacks) => {
        callbacks.onProgress(0.1);
        await config.processingFunction!([
          { hash: '1', blob },
          { hash: '2', blob },
          { hash: '3', blob },
        ]);
        callbacks.onProgress(0.2);
        await config.processingFunction!([
          { hash: '4', blob },
          { hash: '5', blob },
          { hash: '6', blob },
        ]);

        return Promise.resolve();
      },
    );

    return {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFile,
      createFileFromUpload,
      createUpload,
      appendChunksToUpload,
    };
  };
  const authProvider = () => Promise.resolve({ clientId: '', token: '' });

  it('should pass down the file content to Chunkinator', async () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    uploadFile({ content: 'file-content' }, config);

    expect(ChunkinatorMock.mock.calls[0][0]).toEqual('file-content');
  });

  it('should create a MediaStore with the given config', () => {
    const { MediaStoreMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;

    uploadFile({ content: '' }, config);

    expect(MediaStoreMock).toBeCalledWith(config);
  });

  it('should use the file and collection names when creating the file', async () => {
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFileFromUpload,
    } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return Promise.resolve();
    });

    await uploadFile(
      { content: '', name: 'file-name', collection: 'some-collection' },
      config,
    );

    expect(createFileFromUpload).toHaveBeenCalledTimes(1);
    expect(createFileFromUpload).toBeCalledWith(
      { uploadId: 'upload-id-123', name: 'file-name' },
      {
        collection: 'some-collection',
        replaceFileId: 'id-upfront-123',
      },
    );
  });

  it('should append the chunks to the upload in processing function', async () => {
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFileFromUpload,
      appendChunksToUpload,
    } = setup();
    const onProgress = jest.fn();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    await uploadFile({ content: '' }, config, { onProgress });
    await createFileFromUpload();

    expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
    expect(appendChunksToUpload.mock.calls[0][0]).toEqual('upload-id-123');
    expect(appendChunksToUpload.mock.calls[0][1].chunks).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(appendChunksToUpload.mock.calls[0][1].offset).toEqual(0);
    expect(appendChunksToUpload.mock.calls[1][0]).toEqual('upload-id-123');
    expect(appendChunksToUpload.mock.calls[1][1].chunks).toEqual([
      '4',
      '5',
      '6',
    ]);
    expect(appendChunksToUpload.mock.calls[1][1].offset).toEqual(3);
  });

  it('should call onProgress with the upload percentage', async () => {
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFileFromUpload,
    } = setup();
    const onProgress = jest.fn();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    await uploadFile({ content: '' }, config, { onProgress });
    await createFileFromUpload();

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress.mock.calls[0][0]).toEqual(0.1);
    expect(onProgress.mock.calls[1][0]).toEqual(0.2);
  });

  it('should resolve with the fileId of the uploaded file', async () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return Promise.resolve();
    });

    const fileId = await uploadFile({ content: '' }, config);

    expect(fileId).toBe('id-upfront-123');
  });

  it('should reject if there was an error with the upload', () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return Promise.reject('some upload error');
    });

    return expect(uploadFile({ content: '' }, config)).rejects.toEqual(
      'some upload error',
    );
  });

  it('should use id upfront for the new file', async () => {
    const { MediaStoreMock, ChunkinatorMock, config, createFile } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return Promise.resolve();
    });

    const file = uploadFile({ content: '' }, config);
    // notice that we are not awaiting uploadFile here because we want to check that createFile gets called in parallel
    expect(createFile).toHaveBeenCalledTimes(1);

    const fileId = await file;
    expect(fileId).toBe('id-upfront-123');
  });

  it('should create the file after all chunks have been appended', async () => {
    expect.assertions(3);
    const {
      createUpload,
      ChunkinatorMock,
      config,
      createFile,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    (chunkinator as any) = ChunkinatorMock;

    (MediaStore as any) = jest.fn().mockImplementation(() => ({
      createUpload,
      createFile,
      createFileFromUpload() {
        expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
        return createFileFromUpload();
      },
      appendChunksToUpload() {
        expect(createFileFromUpload).toHaveBeenCalledTimes(0);
        return appendChunksToUpload();
      },
    }));

    await uploadFile({ content: '' }, config);
  });
});
