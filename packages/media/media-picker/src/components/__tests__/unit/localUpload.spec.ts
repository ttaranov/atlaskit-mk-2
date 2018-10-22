import { Auth, ContextFactory, ProcessedFileState } from '@atlaskit/media-core';
import { LocalUploadComponent } from '../../localUpload';
import { NewUploadServiceImpl } from '../../../service/newUploadServiceImpl';
import { MediaFile } from '../../../domain/file';
import { UploadEndEventPayload } from '../../..';
import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';

describe('MediaLocalUpload', () => {
  const imageFile: MediaFile = {
    id: 'some-id',
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
    upfrontId: Promise.resolve('some-public-id'),
  };
  const processedState: ProcessedFileState = {
    id: 'some-copied-file-id',
    status: 'processed',
    name: 'some-name',
    size: 42,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'some-mime-type',
  };
  const setup = (options: { shouldCopyFileToRecents?: boolean } = {}) => {
    const context = ContextFactory.create({
      authProvider: () =>
        Promise.resolve<Auth>({ clientId: '', baseUrl: '', token: '' }),
    });
    const config = {
      uploadParams: {
        collection: '',
      },
      shouldCopyFileToRecents: options.shouldCopyFileToRecents,
    };
    const localUpload = new LocalUploadComponent(context, config);
    const uploadService = localUpload['uploadService'] as NewUploadServiceImpl;
    const emitUploadServiceEvent = uploadService['emit'];
    const emitter = localUpload['emitter'];

    jest.spyOn(emitter, 'emit');

    return {
      localUpload,
      emitUploadServiceEvent,
      emitter,
    };
  };

  const extractShouldCopyFileToRecents = (
    localUpload: LocalUploadComponent,
  ) => {
    const uploadService: NewUploadServiceImpl = localUpload[
      'uploadService'
    ] as any;
    return uploadService['shouldCopyFileToRecents'];
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
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    });

    expect(emitter.emit).toBeCalledWith('upload-preview-update', {
      file: expect.objectContaining(imageFile),
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    });
  });

  it('should only emitUploadEnd when file is converted', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('file-converted', {
      file: { ...imageFile, publicId: 'some-id' },
      state: processedState,
    });

    expect(emitter.emit).toHaveBeenCalledTimes(1);
    const expectedPayload: UploadEndEventPayload = {
      file: { ...imageFile, publicId: 'some-id' },
      state: processedState,
    };
    expect(emitter.emit).toBeCalledWith('upload-end', expectedPayload);
  });

  it('should use shouldCopyFileToRecents as true by default and pass to upload service', () => {
    const { localUpload } = setup();
    const shouldCopyFileToRecents = extractShouldCopyFileToRecents(localUpload);
    expect(shouldCopyFileToRecents).toEqual(true);
  });

  it('should use given shouldCopyFileToRecents and pass to upload service', () => {
    const { localUpload } = setup({ shouldCopyFileToRecents: false });
    const shouldCopyFileToRecents = extractShouldCopyFileToRecents(localUpload);
    expect(shouldCopyFileToRecents).toEqual(false);
  });
});
