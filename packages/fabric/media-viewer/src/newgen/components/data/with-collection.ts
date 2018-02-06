import { Component } from 'react';
import { MediaItemType, Context } from '@atlaskit/media-core';
import { MediaViewerDataSource } from '../../../';
import { MediaItemIdentifier, MediaViewerItem, ProcessingStatus, MediaViewerItemType } from '../../domain';

export interface WithCollectionState {}

export interface WithCollectionProps {
  readonly context: Context;
  readonly dataSource: MediaViewerDataSource;  
  readonly selectedItemId: MediaItemIdentifier;
}

export class WithCollection extends Component<WithCollectionProps, WithCollectionState> {
  
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

    // TODO: this data will come from the provider/providers.
    // This component will render call the render function when new collection items arrived,
    // or when any of the pending items changes its processing state.

    // The fact that this logic is encapsulated in this component will make pretty handy to create examples or tests
    // with fake providers that emulate all the different possibilities.

    // NAVIGATION
    // This component can be navigation-aware
    // If we detect that the current item is almost at the end of the collection we can fetch the following items automatically.

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
