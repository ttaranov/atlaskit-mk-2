import { LocalUploadComponent } from '../../src/components/localUpload';

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
    const context = {
      trackEvent: jest.fn(),
    };
    const moduleConfig = {
      apiUrl: 'some-api-url',
      authProvider: jest.fn(),
    };
    const localUpload = new LocalUploadComponent(context, moduleConfig);
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
        width: 100,
        height: 200,
        src: imagePreviewSrc,
      },
    });

    expect(emitter.emit).toBeCalledWith('upload-preview-update', {
      file: expect.objectContaining(imageFile),
      preview: {
        src: imagePreviewSrc,
        width: 100,
        height: 200,
      },
    });
  });
});
