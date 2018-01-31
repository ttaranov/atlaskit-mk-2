import {MediaItemType} from '@atlaskit/media-core';

export enum ProcessingStatus {
  Pending = 'pending',
  Processed = 'processed',
  Error = 'error'
}

export enum MediaViewerItemType {
  Video = 'video',
  Image = 'image',
  PDF = 'pdf'
}

// we need some thought around this.
// which artifacts we expose?
// we are going to expose processingStatus for each individually?
// when is the /image endpoint ready to give us results?
export interface ImageMetadata {
  downloadUrl?: string;
  fullSizeUrl?: string;
  thumbnailUrl?: string;
}

export interface VideoMetadata {
  downloadUrl?: string;
  posterUrl?: string;
  posterThubmailUrl?: string;
  videoUrl?: string;
  videoHDUrl?: string;
}

export type Metadata = ImageMetadata | VideoMetadata;

export interface MediaItemIdentifier {
  readonly id: string;
  readonly mediaItemType: MediaItemType;
  readonly occurrenceKey?: string;
  readonly collectionName?: string;
}

export interface MediaViewerItem {
  readonly identifier: MediaItemIdentifier;
  readonly type: MediaViewerItemType;  
  readonly processingStatus: ProcessingStatus; // TODO: is it going to be per item instead?
  readonly metadata?: Metadata; // only available if prcessingStatus = processed
}

export enum ActionType {
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  Edit = 'edit',
  Annotate = 'annotate',
  Comment = 'comment'
}

export interface Action {
  readonly text: string;
  readonly type: ActionType;
  readonly active: boolean;
}