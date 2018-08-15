import { getLinkMetadata, extendMetadata } from '../../metadata';
import {
  FileState,
  FileDetails,
  UrlPreview,
  LinkItem,
  FileItem,
} from '@atlaskit/media-core';
import { UrlPreviewIdentifier, LinkIdentifier } from '../../../root/domain';
import { of } from 'rxjs/observable/of';

describe('metadata utils', () => {
  describe('getLinkMetadata()', () => {
    const urlPreview: UrlPreview = {
      type: 'link',
      url: 'some-url',
      title: 'some-title',
    };
    const linkItem: LinkItem = {
      type: 'link',
      details: {
        id: '12',
        ...urlPreview,
      },
    };
    const fileItem: FileItem = {
      type: 'file',
      details: {
        id: '12',
      },
    };

    it('should return metadata for url preview indentifier', async () => {
      const identifier: UrlPreviewIdentifier = {
        url: 'some-url',
        mediaItemType: 'link',
      };
      const context = {
        getUrlPreviewProvider: () => ({
          observable: () => of(urlPreview),
        }),
      } as any;
      const metadata = await getLinkMetadata(identifier, context);

      expect(metadata).toEqual(urlPreview);
    });

    it('should return metadata for link indentifier', async () => {
      const identifier: LinkIdentifier = {
        id: '12',
        collectionName: 'some-collection',
        mediaItemType: 'link',
      };
      const context = {
        getMediaItemProvider: () => ({
          observable: () => of(linkItem),
        }),
      } as any;
      const metadata = await getLinkMetadata(identifier, context);

      expect(metadata).toEqual({
        id: '12',
        ...urlPreview,
      });
    });

    it('should reject if link id is not a valid link', async () => {
      const identifier: LinkIdentifier = {
        id: '12',
        collectionName: 'some-collection',
        mediaItemType: 'link',
      };
      const context = {
        getMediaItemProvider: () => ({
          observable: () => of(fileItem),
        }),
      } as any;

      return expect(getLinkMetadata(identifier, context)).rejects.toBe(
        '12 is not a valid link id',
      );
    });
  });

  describe('extendMetadata()', () => {
    it('should not extend when its error state', () => {
      const state: FileState = {
        id: '1',
        status: 'error',
      };
      const existingMetadata: FileDetails = {
        id: '123',
      };

      expect(extendMetadata(state)).toEqual({
        id: '1',
      });
      expect(extendMetadata(state, existingMetadata)).toEqual({
        id: '1',
      });
    });

    it('should extend metadata with file state', () => {
      const state: FileState = {
        id: '1',
        status: 'processing',
        name: 'file-name',
        size: 10,
        mediaType: 'unknown',
        mimeType: 'foo/bar',
      };
      const existingMetadata: FileDetails = {
        id: '123',
        mediaType: 'image',
      };

      expect(extendMetadata(state)).toEqual({
        id: '1',
        name: 'file-name',
        size: 10,
        mediaType: 'unknown',
        mimeType: 'foo/bar',
      });
      expect(extendMetadata(state, existingMetadata)).toEqual({
        id: '1',
        name: 'file-name',
        size: 10,
        mediaType: 'image',
        mimeType: 'foo/bar',
      });
    });
  });
});
