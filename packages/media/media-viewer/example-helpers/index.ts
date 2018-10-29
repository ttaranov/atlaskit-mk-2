import {
  archiveFileId,
  audioFileId,
  audioNoCoverFileId,
  docFileId,
  largePdfFileId,
  imageFileId,
  largeImageFileId,
  smallImageFileId,
  unknownFileId,
  videoFileId,
  videoHorizontalFileId,
  videoLargeFileId,
  videoProcessingFailedId,
  wideImageFileId,
  genericLinkId,
  errorFileId,
} from '@atlaskit/media-test-helpers';
import { MediaViewerItem } from '../src';

export { defaultCollectionName } from '@atlaskit/media-test-helpers';

export const imageIdentifier: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const wideImageIdentifier: MediaViewerItem = {
  type: 'file',
  id: wideImageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const docIdentifier: MediaViewerItem = {
  type: 'file',
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const largePdfIdentifier: MediaViewerItem = {
  type: 'file',
  id: largePdfFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const imageIdentifier2: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'other-ocurrence-key',
};

export const videoIdentifier: MediaViewerItem = {
  type: 'file',
  id: videoFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const unsupportedIdentifier: MediaViewerItem = {
  type: 'file',
  id: unknownFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const imageItem: MediaViewerItem = {
  type: 'file',
  id: imageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const smallImageItem: MediaViewerItem = {
  type: 'file',
  id: smallImageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const largeImageItem: MediaViewerItem = {
  type: 'file',
  id: largeImageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const wideImageItem: MediaViewerItem = {
  type: 'file',
  id: wideImageFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const docItem: MediaViewerItem = {
  type: 'file',
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const videoItem: MediaViewerItem = {
  type: 'file',
  id: videoFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const videoHorizontalFileItem: MediaViewerItem = {
  type: 'file',
  id: videoHorizontalFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const videoLargeFileItem: MediaViewerItem = {
  type: 'file',
  id: videoLargeFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const videoProcessingFailedItem: MediaViewerItem = {
  type: 'file',
  id: videoProcessingFailedId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const audioItem: MediaViewerItem = {
  type: 'file',
  id: audioFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const audioItemNoCover: MediaViewerItem = {
  type: 'file',
  id: audioNoCoverFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const archiveItem: MediaViewerItem = {
  type: 'file',
  id: archiveFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const unsupportedItem: MediaViewerItem = {
  type: 'file',
  id: unknownFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const errorItem: MediaViewerItem = {
  type: 'file',
  id: errorFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};

export const linkItem: MediaViewerItem = {
  type: 'link',
  id: genericLinkId.id,
  occurrenceKey: 'testOccurrenceKey',
};
