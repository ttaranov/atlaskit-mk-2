import {
  Context,
  LinkDetails,
  UrlPreview,
  FileState,
  FileDetails,
  MediaType,
} from '@atlaskit/media-core';
import { LinkIdentifier, UrlPreviewIdentifier } from '../root';
import { isUrlPreviewIdentifier } from './identifier';

export const getLinkMetadata = (
  identifier: LinkIdentifier | UrlPreviewIdentifier,
  context: Context,
): Promise<LinkDetails | UrlPreview> => {
  return new Promise((resolve, reject) => {
    if (isUrlPreviewIdentifier(identifier)) {
      const observable = context
        .getUrlPreviewProvider(identifier.url)
        .observable();
      observable.subscribe({
        next: resolve,
        error: reject,
      });
    } else {
      const { id, mediaItemType, collectionName } = identifier;
      const observable = context
        .getMediaItemProvider(id, mediaItemType, collectionName)
        .observable();

      observable.subscribe({
        next(item) {
          if (item.type === 'file') {
            reject();
          } else {
            resolve(item.details);
          }
        },
        error: reject,
      });
    }
  });
};

export const extendMetadata = (
  state: FileState,
  metadata?: FileDetails,
): FileDetails => {
  const { id } = state;
  const currentMediaType = metadata && metadata.mediaType;
  let name: string | undefined;
  let size: number | undefined;
  let mediaType: MediaType | undefined;

  if (state.status !== 'error') {
    name = state.name;
    size = state.size;
    mediaType =
      currentMediaType && currentMediaType !== 'unknown'
        ? currentMediaType
        : state.mediaType;
  }

  return {
    id,
    name,
    size,
    mediaType,
  };
};
