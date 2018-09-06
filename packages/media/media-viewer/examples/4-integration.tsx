import * as React from 'react';
import {
  Card,
  CardList,
  CardEvent,
  FileIdentifier,
} from '@atlaskit/media-card';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { Container } from '../example-helpers/styled';
import { imageItem, smallImageItem, archiveItem } from '../example-helpers';
import { MediaViewer, MediaViewerItem } from '../src';
import { FileDetails } from '@atlaskit/media-core';

const context = createStorybookContext();
const imageIdentifier: FileIdentifier = {
  id: imageItem.id,
  mediaItemType: 'file',
  collectionName: defaultCollectionName,
};
const smallImageIdentifier: FileIdentifier = {
  id: smallImageItem.id,
  mediaItemType: 'file',
  collectionName: defaultCollectionName,
};

export type State = {
  selectedItem?: MediaViewerItem;
};

export default class Example extends React.Component<{}, State> {
  state: State = { selectedItem: undefined };

  onClose = () => this.setState({ selectedItem: undefined });

  onCardClick = ({ mediaItemDetails }: CardEvent) => {
    if (!mediaItemDetails) {
      return;
    }

    const { id } = mediaItemDetails as FileDetails;
    const selectedItem: MediaViewerItem = {
      id,
      occurrenceKey: imageItem.occurrenceKey,
      type: 'file',
    };

    this.setState({
      selectedItem,
    });
  };

  render() {
    const { selectedItem } = this.state;

    return (
      <Container>
        <div>
          <h1>Card</h1>
          <Card
            context={context}
            identifier={imageIdentifier}
            onClick={this.onCardClick}
          />
          <Card
            context={context}
            identifier={smallImageIdentifier}
            onClick={this.onCardClick}
          />
        </div>
        <div>
          <h1>CardList</h1>
          <CardList context={context} collectionName={defaultCollectionName} />
        </div>
        {selectedItem && (
          <MediaViewer
            featureFlags={{ nextGen: true, customVideoPlayer: true }}
            MediaViewer={null as any}
            basePath={null as any}
            context={context}
            selectedItem={selectedItem}
            dataSource={{ list: [selectedItem, smallImageItem, archiveItem] }}
            collectionName={defaultCollectionName}
            onClose={this.onClose}
          />
        )}
      </Container>
    );
  }
}
