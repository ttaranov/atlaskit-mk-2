jest.mock('uuid');
jest.mock('chunkinator');
jest.mock('../src/media-store');

import * as uuid from 'uuid';
import chunkinator from 'chunkinator';
import { uploadFile } from '../src';
import { MediaStore } from '../src/media-store';

describe('Uploader', () => {
  const setup = () => {
    const ChunkinatorMock = jest.fn();
    const config = {
      serviceHost: '',
      authProvider,
    };
    const createFileFromUpload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: 'file-id-123' } }));
    const createUpload = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: [{ id: 'upload-id-123' }] }));
    const appendChunksToUpload = jest.fn().mockReturnValue(Promise.resolve(1));
    const MediaStoreMock = jest.fn().mockImplementation(() => ({
      createUpload,
      createFileFromUpload,
      appendChunksToUpload,
    }));

    ChunkinatorMock.mockImplementation((_file, _, callbacks) => {
      return {
        response: (async () => {
          callbacks.onProgress(0.1);
          callbacks.onProgress(0.2);
          return [{ hash: '1' }, { hash: '2' }, { hash: '3' }];
        })(),
        cancel: jest.fn(),
      };
    });

    return {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFileFromUpload,
      createUpload,
      appendChunksToUpload,
    };
  };

  const authProvider = () => Promise.resolve({ clientId: '', token: '' });
  (uuid.v4 as jest.Mock<any>).mockReturnValue('some-uuid');

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

  it('should use the file name, collection name and mimeType when creating the file', async () => {
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createFileFromUpload,
    } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    await uploadFile(
      {
        content: '',
        name: 'file-name',
        collection: 'some-collection',
        mimeType: 'image/jpeg',
      },
      config,
    ).deferredFileId;

    expect(createFileFromUpload).toHaveBeenCalledTimes(1);
    expect(createFileFromUpload).toBeCalledWith(
      { uploadId: 'upload-id-123', name: 'file-name', mimeType: 'image/jpeg' },
      {
        occurrenceKey: 'some-uuid',
        collection: 'some-collection',
      },
    );
  });

  it('should append the chunks to the upload after chunks have been uploaded and the upload session has been created', async () => {
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      appendChunksToUpload,
    } = setup();
    const onProgress = jest.fn();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    await uploadFile({ content: '' }, config, { onProgress }).deferredFileId;

    expect(appendChunksToUpload).toHaveBeenCalledTimes(1);
    expect(appendChunksToUpload.mock.calls[0][0]).toEqual('upload-id-123');
    expect(appendChunksToUpload.mock.calls[0][1].chunks).toEqual([
      '1',
      '2',
      '3',
    ]);
  });

  it('should call onProgress with the upload percentage', async () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();
    const onProgress = jest.fn();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    await uploadFile({ content: '' }, config, { onProgress }).deferredFileId;

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress.mock.calls[0][0]).toEqual(0.1);
    expect(onProgress.mock.calls[1][0]).toEqual(0.2);
  });

  it('should resolve with the fileId of the uploaded file', async () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    const fileId = await uploadFile({ content: '' }, config).deferredFileId;
    expect(fileId).toBe('file-id-123');
  });

  it('should reject if chunkinator rejects', () => {
    const { MediaStoreMock, ChunkinatorMock, config } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return {
        response: Promise.reject('some upload error'),
        cancel: jest.fn(),
      };
    });

    return expect(
      uploadFile({ content: '' }, config).deferredFileId,
    ).rejects.toEqual('some upload error');
  });

  it('should NOT attempt to create an upload session if chunkinator fails to upload chunks', async () => {
    expect.assertions(3);
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createUpload,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    ChunkinatorMock.mockImplementation(() => {
      return {
        response: Promise.reject('some upload error'),
        cancel: jest.fn(),
      };
    });

    try {
      await uploadFile(
        { content: '', name: 'file-name', collection: 'some-collection' },
        config,
      ).deferredFileId;
    } catch {
      expect(createUpload).toHaveBeenCalledTimes(0);
      expect(appendChunksToUpload).toHaveBeenCalledTimes(0);
      expect(createFileFromUpload).toHaveBeenCalledTimes(0);
    }
  });

  it('should NOT attempt to append chunks to upload if an upload session can NOT be created', async () => {
    expect.assertions(3);
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createUpload,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    createUpload.mockReturnValue(
      Promise.reject('failed-to-create-upload-session'),
    );
    try {
      await uploadFile(
        { content: '', name: 'file-name', collection: 'some-collection' },
        config,
      ).deferredFileId;
    } catch {
      expect(createUpload).toHaveBeenCalledTimes(1);
      expect(appendChunksToUpload).toHaveBeenCalledTimes(0);
      expect(createFileFromUpload).toHaveBeenCalledTimes(0);
    }
  });

  it('should NOT attempt to create a file from an upload if chunks can NOT be appended to said upload', async () => {
    expect.assertions(3);
    const {
      MediaStoreMock,
      ChunkinatorMock,
      config,
      createUpload,
      appendChunksToUpload,
      createFileFromUpload,
    } = setup();

    (MediaStore as any) = MediaStoreMock;
    (chunkinator as any) = ChunkinatorMock;

    appendChunksToUpload.mockReturnValue(
      Promise.reject('failed-to-create-upload-session'),
    );
    try {
      await uploadFile(
        { content: '', name: 'file-name', collection: 'some-collection' },
        config,
      ).deferredFileId;
    } catch {
      expect(createUpload).toHaveBeenCalledTimes(1);
      expect(appendChunksToUpload).toHaveBeenCalledTimes(1);
      expect(createFileFromUpload).toHaveBeenCalledTimes(0);
    }
  });
});
