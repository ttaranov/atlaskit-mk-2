import * as React from 'react';
import { Component } from 'react';
import { Context, MediaItemType } from '@atlaskit/media-core';

import { MediaCollectionViewer } from './media-collection-viewer';
import { MediaFileListViewer } from './media-file-list-viewer';

import { MediaViewerConstructor, MediaViewerConfig } from '../mediaviewer';

import { MediaViewer as MediaViewerNextGen } from '../newgen/media-viewer';

export interface MediaViewerItem {
  id: string;
  occurrenceKey: string;
  type: MediaItemType;
}

export interface MediaViewerDataSource {
  list?: Array<MediaViewerItem>;
  collectionName?: string;
}

export interface MediaViewerProps {
  readonly context: Context;

  readonly selectedItem: MediaViewerItem;
  readonly dataSource: MediaViewerDataSource;

  readonly collectionName: string;
  readonly pageSize?: number;

  readonly MediaViewer: MediaViewerConstructor;
  readonly mediaViewerConfiguration?: MediaViewerConfig;
  readonly basePath: string;
  readonly onClose?: () => void;

  readonly featureFlags?: { nextGen?: boolean };
}

export interface MediaViewerState {}

export class MediaViewer extends Component<MediaViewerProps, MediaViewerState> {
  render(): JSX.Element {
    const { featureFlags, onClose } = this.props;
    if (featureFlags && featureFlags.nextGen) {
      return <MediaViewerNextGen onClose={onClose} />;
    }

    if (this.props.dataSource.list) {
      return (
        <MediaFileListViewer
          context={this.props.context}
          selectedItem={this.props.selectedItem}
          list={this.props.dataSource.list}
          collectionName={this.props.collectionName}
          MediaViewer={this.props.MediaViewer}
          mediaViewerConfiguration={this.props.mediaViewerConfiguration}
          basePath={this.props.basePath}
          onClose={this.props.onClose}
        />
      );
    } else if (this.props.dataSource.collectionName) {
      return (
        <MediaCollectionViewer
          context={this.props.context}
          selectedItem={this.props.selectedItem}
          collectionName={this.props.dataSource.collectionName}
          pageSize={this.props.pageSize}
          MediaViewer={this.props.MediaViewer}
          mediaViewerConfiguration={this.props.mediaViewerConfiguration}
          basePath={this.props.basePath}
          onClose={this.props.onClose}
        />
      );
    } else {
      throw new Error(
        'MediaViewer does not support the provided datasource (MediaViewerDataSource)',
      );
    }
  }
}
