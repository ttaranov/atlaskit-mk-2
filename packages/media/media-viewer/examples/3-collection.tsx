import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';
import Button from '@atlaskit/button';
import { isError } from '@atlaskit/media-core';
import { Subscription } from 'rxjs';

const context = createStorybookContext();

export type State = {
  selectedItem?: MediaViewerItem;
};
export default class Example extends React.Component<{}, {}> {
  state: State = {};

  private subscription: Subscription;

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.open}>Open MediaViewer</Button>
        {this.state.selectedItem && (
          <MediaViewer
            featureFlags={{ nextGen: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={this.state.selectedItem}
            dataSource={{ collectionName: defaultCollectionName }}
            collectionName={defaultCollectionName}
            onClose={this.onClose}
            pageSize={5}
          />
        )}
      </div>
    );
  }

  private open = () => {
    // Always get the first item on the collection to avoid having the error of "selected item" not found
    // when added more items to the top.
    // MSW-668 will provide a more consistent collection to work as example
    this.subscription = context
      .getMediaCollectionProvider(defaultCollectionName, 1)
      .observable()
      .subscribe({
        next: collection => {
          if (!isError(collection)) {
            const firstItem = collection.items[0];
            if (firstItem) {
              this.setState({
                selectedItem: {
                  id: firstItem.details.id,
                  type: firstItem.type,
                  occurrenceKey: firstItem.details.occurrenceKey,
                },
              });
            } else {
              console.error('No items found in the collection');
            }
          } else {
            console.error(collection);
          }
        },
      });
  };

  private onClose = () => {
    this.setState({ selectedItem: undefined });
  };
}
