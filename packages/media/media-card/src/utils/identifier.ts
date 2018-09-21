import {
  Identifier,
  UrlPreviewIdentifier,
  ExternalImageIdentifier,
} from '../root/domain';

export const isUrlPreviewIdentifier = (
  identifier: Identifier,
): identifier is UrlPreviewIdentifier => {
  const preview = identifier as UrlPreviewIdentifier;
  return preview && preview.url !== undefined;
};

export const isExternalImageIdentifier = (
  identifier: Identifier,
): identifier is ExternalImageIdentifier => {
  return identifier.mediaItemType === 'external-image';
};
