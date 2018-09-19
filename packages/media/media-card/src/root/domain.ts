import {
  MediaItemProvider,
  UrlPreviewProvider,
  MediaType,
} from '@atlaskit/media-core';

export type Identifier =
  | UrlPreviewIdentifier
  | LinkIdentifier
  | FileIdentifier
  | ExternalIdentifier;
export type Provider = MediaItemProvider | UrlPreviewProvider;

export interface FileIdentifier {
  readonly mediaItemType: 'file';
  readonly id: string | Promise<string>;
  readonly occurrenceKey?: string;
  readonly collectionName?: string; // files can exist outside of a collection
}

export interface LinkIdentifier {
  readonly mediaItemType: 'link';
  readonly id: string;
  readonly occurrenceKey?: string;
  readonly collectionName: string; // links always exist within a collection
}

export interface UrlPreviewIdentifier {
  readonly mediaItemType: 'link';
  readonly url: string;
}

export interface ExternalIdentifier {
  readonly mediaItemType: 'external';
  readonly dataURI: string;
  readonly name?: string;
}

export const isPreviewableType = (type: MediaType): boolean => {
  return ['audio', 'video', 'image'].indexOf(type) > -1;
};
