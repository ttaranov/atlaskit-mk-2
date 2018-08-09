import {
  MediaFileAttributesFactory,
  FileItemWithOccurrenceKey,
} from '../../src/domain/media-file-attributes';

describe('MediaFileAttributes', () => {
  describe('fromFileItem', () => {
    const baseUrl = 'https://filestore.io';

    it('should return binary url given no artifacts', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.basicFile,
        baseUrl,
      );
      expect(attributes.id).toBe('basic-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/basic-file/binary?max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/basic-file/binary?dl=1',
      );
      expect(attributes.type).toBe(undefined);
      expect(attributes.title).toBe(undefined);
      expect(attributes.src_hd).toBe(undefined);
      expect(attributes.poster).toBe(undefined);
    });

    it('should return binary url given gif file', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.gifFile,
        baseUrl,
      );
      expect(attributes.id).toBe('gif-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/gif-file/binary?max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/gif-file/binary?dl=1',
      );
      expect(attributes.type).toBe('image/gif');
      expect(attributes.title).toBe('Some GIF');
    });

    it('should return image url given jpg file', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.jpgFile,
        baseUrl,
      );
      expect(attributes.id).toBe('jpg-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/jpg-file/image?max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/jpg-file/binary?dl=1',
      );
      expect(attributes.type).toBe(undefined);
      expect(attributes.title).toBe('Some JPG');
    });

    it('should return type video/mp4 given SD video', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.sdVideoFile,
        baseUrl,
      );
      expect(attributes.id).toBe('sd-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/hd-file/artifact/video_640.mp4/binary?max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/sd-file/binary?dl=1',
      );
      expect(attributes.type).toBe('video/mp4');
      expect(attributes.title).toBe('Some SD Video');
      expect(attributes.src_hd).toBe(undefined);
      expect(attributes.poster).toBe(
        'https://filestore.io/file/hd-file/artifact/poster_640.mp4/binary',
      );
    });

    it('should return HD url and HD poster given HD artifacts exists', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.hdVideoFile,
        baseUrl,
      );
      expect(attributes.id).toBe('hd-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/hd-file/artifact/video_640.mp4/binary?max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/hd-file/binary?dl=1',
      );
      expect(attributes.type).toBe('video/mp4');
      expect(attributes.title).toBe('Some HD Video');
      expect(attributes.src_hd).toBe(
        'https://filestore.io/file/hd-file/artifact/video_1280.mp4/binary',
      );
      expect(attributes.poster).toBe(
        'https://filestore.io/file/hd-file/artifact/poster_1280.mp4/binary',
      );
    });

    it('should handle artifacts with existent URL params', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.fileWithParamsInArtifactUrl,
        baseUrl,
      );
      expect(attributes.id).toBe('hd-file-some-occurrenceKey');
      expect(attributes.src).toBe(
        'https://filestore.io/file/hd-file/artifact/video_640.mp4/binary?param=1&max-age=3600',
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/hd-file/binary?dl=1',
      );
      expect(attributes.type).toBe('video/mp4');
      expect(attributes.title).toBe('Some HD Video');
      expect(attributes.src_hd).toBe(
        'https://filestore.io/file/hd-file/artifact/video_1280.mp4/binary?param=1',
      );
      expect(attributes.poster).toBe(
        'https://filestore.io/file/hd-file/artifact/poster_1280.mp4/binary?param=1',
      );
    });

    it('should return download url from binary', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.basicFile,
        baseUrl,
      );
      expect(attributes.srcDownload).toBe(
        'https://filestore.io/file/basic-file/binary?dl=1',
      );
    });

    it('should handle files with no occurrenceKey', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.basicFileWithoutOcurrenceKey,
        baseUrl,
      );
      expect(attributes.id).toBe('basic-file-no-occurrenceKey');
    });

    it('should mark unprocessed files as unsupported so they can be processed propertly by MediaViewer classic', () => {
      const attributes = MediaFileAttributesFactory.fromFileItem(
        Mocks.unprocessedFile,
        baseUrl,
      );
      expect(attributes.type).toBe('non-supported');
    });
  });
});

class Mocks {
  static basicFileWithoutOcurrenceKey = {
    details: {
      id: 'basic-file',
      processingStatus: 'succeeded',
    },
  } as FileItemWithOccurrenceKey;

  static basicFile = {
    details: {
      id: 'basic-file',
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static gifFile = {
    details: {
      id: 'gif-file',
      name: 'Some GIF',
      mimeType: 'image/gif',
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static jpgFile = {
    details: {
      id: 'jpg-file',
      name: 'Some JPG',
      mimeType: 'image/jpeg',
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static unprocessedFile = {
    details: {
      id: 'jpg-file',
      name: 'Some JPG',
      mimeType: 'image/jpeg',
      processingStatus: 'pending',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static sdVideoFile = {
    type: 'file',
    details: {
      id: 'sd-file',
      name: 'Some SD Video',
      mediaType: 'video',
      artifacts: {
        'video_640.mp4': {
          url: '/file/hd-file/artifact/video_640.mp4/binary',
        },
        'poster_640.jpg': {
          url: '/file/hd-file/artifact/poster_640.mp4/binary',
        },
      },
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static hdVideoFile = {
    type: 'file',
    details: {
      id: 'hd-file',
      name: 'Some HD Video',
      mediaType: 'video',
      artifacts: {
        'video_640.mp4': {
          url: '/file/hd-file/artifact/video_640.mp4/binary',
        },
        'video_1280.mp4': {
          url: '/file/hd-file/artifact/video_1280.mp4/binary',
        },
        'poster_640.jpg': {
          url: '/file/hd-file/artifact/poster_640.mp4/binary',
        },
        'poster_1280.jpg': {
          url: '/file/hd-file/artifact/poster_1280.mp4/binary',
        },
      },
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;

  static fileWithParamsInArtifactUrl = {
    type: 'file',
    details: {
      id: 'hd-file',
      name: 'Some HD Video',
      mediaType: 'video',
      artifacts: {
        'video_640.mp4': {
          url: '/file/hd-file/artifact/video_640.mp4/binary?param=1',
        },
        'video_1280.mp4': {
          url: '/file/hd-file/artifact/video_1280.mp4/binary?param=1',
        },
        'poster_640.jpg': {
          url: '/file/hd-file/artifact/poster_640.mp4/binary?param=1',
        },
        'poster_1280.jpg': {
          url: '/file/hd-file/artifact/poster_1280.mp4/binary?param=1',
        },
      },
      processingStatus: 'succeeded',
    },
    occurrenceKey: 'some-occurrenceKey',
  } as FileItemWithOccurrenceKey;
}
