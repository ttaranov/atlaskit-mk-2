import * as React from 'react';
import { Component } from 'react';
import { Context, MediaItemType } from '@atlaskit/media-core';
import { MediaCollectionViewer } from './media-collection-viewer';
import { MediaFileListViewer } from './media-file-list-viewer';
import { MediaViewerConstructor, MediaViewerConfig } from '../mediaviewer';
import { MediaViewer as MediaViewerNextGen } from '../newgen/media-viewer';
import { ItemSource, MediaViewerFeatureFlags } from '../newgen/domain';
import { getFeatureFlag } from '../newgen/utils/getFeatureFlag';

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

  readonly featureFlags?: MediaViewerFeatureFlags;
}

export interface MediaViewerState {}

export class MediaViewer extends Component<MediaViewerProps, MediaViewerState> {
  render(): JSX.Element {
    const {
      featureFlags,
      onClose,
      context,
      selectedItem,
      collectionName,
      dataSource,
      pageSize,
    } = this.props;

    const defaultPageSize = 30;
    const useMVnextGen = getFeatureFlag('nextGen', featureFlags);

    if (useMVnextGen) {
      if (dataSource.collectionName) {
        const itemSource: ItemSource = {
          kind: 'COLLECTION',
          collectionName: dataSource.collectionName,
          pageSize: pageSize || defaultPageSize,
        };
        const identifier = {
          ...selectedItem,
          collectionName: dataSource.collectionName,
        };
        return (
          <MediaViewerNextGen
            context={context}
            selectedItem={identifier}
            onClose={onClose}
            itemSource={itemSource}
            featureFlags={featureFlags}
          />
        );
      } else if (dataSource.list) {
        const items = dataSource.list.map(i => ({
          ...i,
          collectionName,
        }));
        const itemSource: ItemSource = {
          kind: 'ARRAY',
          items: items,
        };
        const identifier = {
          ...selectedItem,
          collectionName,
        };
        return (
          <MediaViewerNextGen
            context={context}
            selectedItem={identifier}
            onClose={onClose}
            itemSource={itemSource}
            featureFlags={featureFlags}
          />
        );
      }
    }

    if (dataSource.list) {
      return (
        <MediaFileListViewer
          context={context}
          selectedItem={selectedItem}
          list={dataSource.list}
          collectionName={collectionName}
          MediaViewer={this.props.MediaViewer}
          mediaViewerConfiguration={this.props.mediaViewerConfiguration}
          basePath={this.props.basePath}
          onClose={onClose}
        />
      );
    } else if (dataSource.collectionName) {
      return (
        <MediaCollectionViewer
          context={context}
          selectedItem={selectedItem}
          collectionName={dataSource.collectionName}
          pageSize={pageSize}
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
