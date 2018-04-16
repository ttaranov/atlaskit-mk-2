import * as React from 'react';
import { Component } from 'react';
import { FileIdentifier } from './media-viewer';
import { Context, FileItem } from '@atlaskit/media-core';

export interface ItemViewerProps {
  identifier: FileIdentifier;
  context: Context;
}

export interface ItemViewerState {
  item?: FileItem;
}

export default class ItemViewer extends Component<
  ItemViewerProps,
  ItemViewerState
> {
  state: ItemViewerState = {};

  fetchItem() {
    const { context, identifier } = this.props;
    const { id, collectionName } = identifier;
    const provider = context.getMediaItemProvider(id, 'file', collectionName);

    provider.observable().subscribe({
      next(item) {
        if (item.type === 'file') {
          this.setState({ item });
        }
      },
    });
  }

  render() {
    const { item } = this.state;
    if (!item) return null;

    return <div>{item.details.name}</div>;
  }
}
