import { Component } from 'react';
import { MediaItemType, Context } from '@atlaskit/media-core';
import { MediaViewerDataSource } from '../src/';
import { MediaItemIdentifier, MediaViewerItem, ProcessingStatus, MediaViewerItemType } from '../src/newgen/domain';

export interface MockWithCollectionState {}

export interface MockWithCollectionProps {
  readonly context: Context;
  readonly dataSource: MediaViewerDataSource;  
  readonly selectedItemId: MediaItemIdentifier;
}

export class MockWithCollection extends Component<MockWithCollectionProps, MockWithCollectionState> {
  
  render() {
    
    const {selectedItemId} = this.props;
    
    const mediaItemType = 'file' as MediaItemType;

    const itemReady = {
      identifier: {id: '1', occurrenceKey: '', collection: 'col1', mediaItemType}, 
      processingStatus: ProcessingStatus.Processed,
      metadata: {
        fullSizeUrl: 'https://picsum.photos/500/300?image=0'
      },
      type: MediaViewerItemType.Image
    };

    const itemPending = {
      identifier: {id: '2', occurrenceKey: '', collection: 'col1', mediaItemType}, 
      processingStatus: ProcessingStatus.Pending,
      metadata: {
        fullSizeUrl: 'https://picsum.photos/500/300?image=1'
      },
      type: MediaViewerItemType.Image
    };

    const itemError = {
      identifier: {id: '3', occurrenceKey: '', collection: 'col1', mediaItemType}, 
      processingStatus: ProcessingStatus.Error,
      type: MediaViewerItemType.Image
    };

    const items: MediaViewerItem[] = [
      itemReady,
      itemPending,
      itemError
    ];

    const selectedItem = items.find((i) => i.identifier.id === selectedItemId.id);
    if (typeof this.props.children === 'function') {
      return this.props.children(items, selectedItem);
    }
    else {
      console.log('props', this.props);
      throw new Error('No child function provided to With-Collection');
    }
  }
}
