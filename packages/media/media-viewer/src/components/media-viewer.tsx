import * as React from 'react';
import { Component } from 'react';
import { Context, MediaItemType } from '@atlaskit/media-core';
import { MediaViewer as MediaViewerNextGen } from '../newgen/media-viewer';
import { ItemSource, MediaViewerFeatureFlags } from '../newgen/domain';

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

    if (dataSource.list) {
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
    } else if (dataSource.collectionName) {
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
    } else {
      throw new Error();
    }
  }
}
