import * as React from 'react';
import { Component } from 'react';
import { Context } from '@atlaskit/media-core';
import { MediaViewerDataSource } from '../';
import { WithCollection } from './components/data/with-collection';
import { WithList } from './components/data/with-list';
import { MediaItemIdentifier, MediaViewerItem } from './domain/index';
import { MediaViewerRenderer } from './components/mediaviewer';

export interface MediaViewerState {
  readonly selectedItem: MediaViewerItem;
}

export interface MediaViewerProps {
  readonly context: Context;
  readonly selectedItemId: MediaItemIdentifier; // selectedItemId instead?
  readonly dataSource: MediaViewerDataSource;
}

export class MediaViewer extends Component<MediaViewerProps, MediaViewerState> {

  render() {
    const {selectedItemId} = this.props;
    return <MediaViewerRenderer 
      selectedItemId={selectedItemId} 
      DataComponent={this.getDataComponentComponent()}
    />;
  }

  private getDataComponentComponent() {
    const {dataSource, context} = this.props;

    // In the examples folder or for testing we can use a custom Static WithCollection 
    // or WithList that provides a known state

    if (dataSource.collectionName) {
      return ({children, selectedItemId}) => (
        <WithCollection context={context} selectedItemId={selectedItemId} dataSource={dataSource}>
          {children}
        </WithCollection>
      );  
    } else {
      return ({children, selectedItemId}) => (
        <WithList context={context} selectedItemId={selectedItemId} dataSource={dataSource}>
          {children}
        </WithList>
      );
    }
  }
}