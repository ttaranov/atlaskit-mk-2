import {
  Context,
  LinkDetails,
  UrlPreview,
  FileState,
  FileDetails,
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
            reject(`${id} is not a valid link id`);
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
  if (state.status !== 'error') {
    return {
      id,
      name: state.name,
      size: state.size,
      mimeType: state.mimeType,
      mediaType:
        currentMediaType && currentMediaType !== 'unknown'
          ? currentMediaType
          : state.mediaType,
    };
  } else {
    return {
      id,
    };
  }
};
