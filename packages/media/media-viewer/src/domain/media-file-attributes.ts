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
import { stringify } from 'query-string';

export interface FileItemWithOccurrenceKey extends FileItem {
  readonly occurrenceKey: string;
}

export class MediaFileAttributesFactory {
  static create(
    id = '',
    details: FileDetails,
    baseUrl: string,
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

      return undefined;
    };

    const artifact = artifactFormat && getArtifactUrl(artifactFormat.name);
    const resource = imageUrl(details) || artifact || binary;
    const video1280 = getArtifactUrl('video_1280.mp4');
    const poster1280 = getArtifactUrl('poster_1280.jpg');
    const poster640 = getArtifactUrl('poster_640.jpg');

    const additionalParams = {
      'max-age': 3600,
    };

    const paramsSeparator = resource.indexOf('?') > -1 ? '&' : '?';

    // If the processing status is empty means the observable resolved with error
    const isError = !details.processingStatus;
    const processed = details.processingStatus === 'succeeded';
    const mediaType = artifactFormat ? artifactFormat.type : details.mediaType;
    const type = isError ? 'error' : processed ? mediaType : 'non-supported';

    return {
      id,
      src: `${baseUrl}${resource}${paramsSeparator}${stringify(
        additionalParams,
      )}`,
      srcDownload: `${baseUrl}${binary}?dl=1`,
      type,
      title: details.name,
      src_hd: video1280 && `${baseUrl}${video1280}`,
      poster: poster1280
        ? `${baseUrl}${poster1280}`
        : poster640 && `${baseUrl}${poster640}`,
    };
  }

  static getUniqueMediaViewerId(selectedItem: MediaViewerItem) {
    return `${selectedItem.id}-${selectedItem.occurrenceKey ||
      'no-occurrenceKey'}`;
  }

  static fromFileItem(
    item: FileItemWithOccurrenceKey,
    baseUrl: string,
  ): MediaFileAttributes {
    const id = MediaFileAttributesFactory.getUniqueMediaViewerId({
      id: item.details.id,
      occurrenceKey: item.occurrenceKey,
      type: 'file',
    });
    return MediaFileAttributesFactory.create(id, item.details, baseUrl);
  }

  static fromMediaCollectionFileItem(
    item: MediaCollectionFileItem,
    baseUrl: string,
  ): MediaFileAttributes {
    const id = MediaFileAttributesFactory.getUniqueMediaViewerId({
      id: item.details.id,
      occurrenceKey: item.details.occurrenceKey,
      type: 'file',
    });
    return MediaFileAttributesFactory.create(id, item.details, baseUrl);
  }

  static fromFileItemList(
    items: Array<FileItemWithOccurrenceKey>,
    baseUrl: string,
  ): Array<MediaFileAttributes> {
    return items.map(item =>
      MediaFileAttributesFactory.fromFileItem(item, baseUrl),
    );
  }

  static fromMediaCollection(
    collection: MediaCollection,
    baseUrl: string,
  ): Array<MediaFileAttributes> {
    const collectionFileItemFilter = (item: MediaCollectionItem) =>
      item.type === 'file';
    return collection.items
      .filter(collectionFileItemFilter)
      .map((item: MediaCollectionItem) =>
        MediaFileAttributesFactory.fromMediaCollectionFileItem(
          item as MediaCollectionFileItem,
          baseUrl,
        ),
      );
  }
}
