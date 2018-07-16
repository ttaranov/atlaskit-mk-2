import { FileItem, LinkItem } from '@atlaskit/media-core';
import { ArtifactFormat } from '../../src/domain/artifact-format';

describe('ArtifactFormat', () => {
  describe('fromMediaItem', () => {
    it('should return undefined for partial files', () => {
      expect(ArtifactFormat.fromMediaItem(Mocks.partialFile)).toBe(undefined);
    });

    it('should return image/gif for files with mime type image/gif', () => {
      expect(ArtifactFormat.fromMediaItem(Mocks.gifFile)).toEqual({
        name: 'original',
        type: 'image/gif',
      });
    });

    it('should return correct media viewer item type for various media types', () => {
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('doc')),
      ).toEqual({ type: 'application/pdf', name: 'document.pdf' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('image')),
      ).toEqual({ type: 'image/jpeg', name: 'image.jpg' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('audio')),
      ).toEqual({ type: 'audio/mpeg', name: 'audio.mp3' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('video')),
      ).toEqual({ type: 'video/mp4', name: 'video_640.mp4' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('archive')),
      ).toEqual({ type: 'not/supported', name: 'original' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('model')),
      ).toEqual({ type: 'application/x-sea', name: 'model.sea' });
      expect(
        ArtifactFormat.fromMediaItem(Mocks.fileFromMediaType('unknown')),
      ).toEqual({ type: 'not/supported', name: 'original' });
    });

    it('should return undefined for links', () => {
      expect(ArtifactFormat.fromMediaItem(Mocks.link)).toBe(undefined);
    });
  });
});

class Mocks {
  static partialFile: FileItem = {
    type: 'file',
    details: { id: 'id' },
  };

  static gifFile: FileItem = {
    type: 'file',
    details: {
      id: 'id',
      mimeType: 'image/gif',
    },
  };

  static fileFromMediaType = (mediaType: string) => {
    return {
      type: 'file',
      details: {
        mediaType,
      },
    } as FileItem;
  };

  static link: LinkItem = {
    type: 'link',
    details: {
      id: 'f57b5f1e-d9f6-489a-aad0-04ea4da14e07',
      type: 'image',
      url: 'https://i.vimeocdn.com/portrait/58832_300x300',
      title: '58832_300x300',
    },
  };
}
