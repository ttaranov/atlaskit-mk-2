import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';
import { Subscription } from 'rxjs';
import { CardList, CardListEvent } from '@atlaskit/media-card';

const context = createStorybookContext();
const pageSize = 5;

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
        <CardList
          context={context}
          collectionName={defaultCollectionName}
          onCardClick={this.openCard}
          pageSize={pageSize}
        />
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
            pageSize={pageSize}
          />
        )}
      </div>
    );
  }

  private openCard = (e: CardListEvent) => {
    this.setState({
      selectedItem: {
        ...e.mediaCollectionItem.details,
        type: e.mediaCollectionItem.type,
      },
    });
  };

  private onClose = () => {
    this.setState({ selectedItem: undefined });
  };
}
