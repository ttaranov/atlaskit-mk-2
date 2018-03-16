import * as React from 'react';
import { Component } from 'react';
import { Context, MediaItemType } from '@atlaskit/media-core';

import { MediaCollectionViewer } from './media-collection-viewer';
import { MediaFileListViewer } from './media-file-list-viewer';

import { MediaViewerConstructor, MediaViewerConfig } from '../mediaviewer';

import { MediaViewer as MediaViewerNextGen } from '../newgen/media-viewer';
import { StoreImpl } from '../newgen/domain';

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
    const { featureFlags, onClose, context, selectedItem, collectionName } = this.props;
    if (featureFlags && featureFlags.nextGen) {
      return <MediaViewerNextGen
              context={context}
              data={{
                type: selectedItem.type,
                id: selectedItem.id,
                occurrenceKey: selectedItem.occurrenceKey,
                collectionName
              }}
              onClose={onClose}
            />;
    }

    if (this.props.dataSource.list) {
      return (
        <MediaFileListViewer
          context={context}
          selectedItem={selectedItem}
          list={this.props.dataSource.list}
          collectionName={collectionName}
          MediaViewer={this.props.MediaViewer}
          mediaViewerConfiguration={this.props.mediaViewerConfiguration}
          basePath={this.props.basePath}
          onClose={onClose}
        />
      );
    } else if (this.props.dataSource.collectionName) {
      return (
        <MediaCollectionViewer
          context={context}
          selectedItem={selectedItem}
          collectionName={this.props.dataSource.collectionName}
          pageSize={this.props.pageSize}
          MediaViewer={this.props.MediaViewer}
          mediaViewerConfiguration={this.props.mediaViewerConfiguration}
          basePath={this.props.basePath}
          onClose={onClose}
        />
      );
    } else {
      throw new Error(
        'MediaViewer does not support the provided datasource (MediaViewerDataSource)',
      );
    }
  }
}
