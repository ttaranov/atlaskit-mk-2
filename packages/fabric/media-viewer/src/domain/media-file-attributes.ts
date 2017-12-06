import {
  FileItem,
  FileDetails,
  MediaCollection,
  MediaCollectionItem,
  MediaCollectionFileItem,
} from '@atlaskit/media-core';
import { ArtifactFormat } from './artifact-format';
import { MediaFileAttributes } from '../mediaviewer';
import { MediaViewerItem } from '../components/media-viewer';

export interface FileItemWithOccurrenceKey extends FileItem {
  readonly occurrenceKey: string;
}

export class MediaFileAttributesFactory {
  static create(
    id = '',
    details: FileDetails,
    serviceHost: string,
  ): MediaFileAttributes {
    const getArtifactUrl = (name: string) => {
      return (
        details.artifacts &&
        details.artifacts[name] &&
        details.artifacts[name].url
      );
    };

    const binary = `/file/${details.id}/binary`;
    const artifactFormat = ArtifactFormat.fromFileDetails(details);

    const imageUrl = (details: FileDetails): string | undefined => {
      if (details.mimeType === 'image/jpeg') {
        return `/file/${details.id}/image`;
      }
    };

    const artifact = artifactFormat && getArtifactUrl(artifactFormat.name);
    const resource = imageUrl(details) || artifact || binary;
    const video1280 = getArtifactUrl('video_1280.mp4');
    const poster1280 = getArtifactUrl('poster_1280.jpg');
    const poster640 = getArtifactUrl('poster_640.jpg');

    return {
      id,
      src: `${serviceHost}${resource}`,
      srcDownload: `${serviceHost}${binary}?dl=1`,
      type: artifactFormat ? artifactFormat.type : details.mediaType,
      title: details.name,
      src_hd: video1280 && `${serviceHost}${video1280}`,
      poster: poster1280
        ? `${serviceHost}${poster1280}`
        : poster640 && `${serviceHost}${poster640}`,
    };
  }

  static getUniqueMediaViewerId(selectedItem: MediaViewerItem) {
    return `${selectedItem.id}-${selectedItem.occurrenceKey ||
      'no-occurrenceKey'}`;
  }

  static fromFileItem(
    item: FileItemWithOccurrenceKey,
    serviceHost: string,
  ): MediaFileAttributes {
    const id = MediaFileAttributesFactory.getUniqueMediaViewerId({
      id: item.details.id as string,
      occurrenceKey: item.occurrenceKey,
      type: 'file',
    });
    return MediaFileAttributesFactory.create(id, item.details, serviceHost);
  }

  static fromMediaCollectionFileItem(
    item: MediaCollectionFileItem,
    serviceHost: string,
  ): MediaFileAttributes {
    const id = MediaFileAttributesFactory.getUniqueMediaViewerId({
      id: item.details.id as string,
      occurrenceKey: item.details.occurrenceKey,
      type: 'file',
    });
    return MediaFileAttributesFactory.create(id, item.details, serviceHost);
  }

  static fromFileItemList(
    items: Array<FileItemWithOccurrenceKey>,
    serviceHost: string,
  ): Array<MediaFileAttributes> {
    return items.map(item =>
      MediaFileAttributesFactory.fromFileItem(item, serviceHost),
    );
  }

  static fromMediaCollection(
    collection: MediaCollection,
    serviceHost: string,
  ): Array<MediaFileAttributes> {
    const collectionFileItemFilter = (item: MediaCollectionItem) =>
      item.type === 'file';
    return collection.items
      .filter(collectionFileItemFilter)
      .map((item: MediaCollectionFileItem) =>
        MediaFileAttributesFactory.fromMediaCollectionFileItem(
          item,
          serviceHost,
        ),
      );
  }
}
