import { LocalUploadComponent } from '../localUpload';
import { Auth, ContextFactory } from '@atlaskit/media-core';

describe('MediaLocalUpload', () => {
  const imagePreviewSrc = 'some-image-src';
  const imageFile = {
    id: 'some-id',
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
    publicId: 'some-public-id',
  };
  const setup = () => {
    const context = ContextFactory.create({
      authProvider: () =>
        Promise.resolve<Auth>({ clientId: '', baseUrl: '', token: '' }),
    });
    const config = {
      uploadParams: {
        collection: '',
      },
    };
    const localUpload = new LocalUploadComponent(context, config);
    const uploadService = localUpload['uploadService'];
    const emitUploadServiceEvent = uploadService['emit'];
    const emitter = localUpload['emitter'];

    jest.spyOn(emitter, 'emit');

    return {
      localUpload,
      emitUploadServiceEvent,
      emitter,
    };
  };

  it('should emit uploads-start event given upload service emits files-added event', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('files-added', {
      files: [imageFile],
    });

    expect(emitter.emit).toBeCalledWith('uploads-start', {
      files: [expect.objectContaining(imageFile)],
    });
  });

  it('should emit upload-preview-update event given upload service emits file-preview-update event', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('file-preview-update', {
      file: imageFile,
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        src: imagePreviewSrc,
      },
    });

    expect(emitter.emit).toBeCalledWith('upload-preview-update', {
      file: expect.objectContaining(imageFile),
      preview: {
        src: imagePreviewSrc,
        dimensions: {
          width: 100,
          height: 200,
        },
      },
    });
  });

  it('should only emitUploadEnd when file is converted', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('file-converted', {
      file: imageFile,
      public: { id: 'some-id' },
    });

    expect(emitter.emit).toHaveBeenCalledTimes(1);
    expect(emitter.emit).toBeCalledWith('upload-end', {
      file: imageFile,
      public: { id: 'some-id' },
    });
  });
});
