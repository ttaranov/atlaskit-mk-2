import {
  FileIdentifier,
  Identifier,
  UrlPreviewIdentifier,
} from '../root/domain';

export const isUrlPreviewIdentifier = (
  identifier: Identifier,
): identifier is UrlPreviewIdentifier => {
  const preview = identifier as UrlPreviewIdentifier;
  return preview && preview.url !== undefined;
};

export const isFileIdentifier = (
  identifier: Identifier,
): identifier is FileIdentifier => {
  return identifier.mediaItemType === 'file';
};
