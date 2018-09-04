import * as React from 'react';
import { Component } from 'react';
import { createUserContext } from '@atlaskit/media-test-helpers';
import { Subscription } from 'rxjs/Subscription';
import { Card, FileIdentifier } from '@atlaskit/media-card';
import Button from '@atlaskit/button';
import { CardsWrapper } from '../example-helpers/styled';

const context = createUserContext();

export interface ExampleState {
  fileIds: string[];
}

class Example extends Component<{}, ExampleState> {
  subscription?: Subscription;

  state: ExampleState = {
    fileIds: [],
  };

  componentDidMount() {
    this.subscription = context.collection.getItems('recents').subscribe({
      next: fileIds => {
        console.log(fileIds);
        this.setState({
          fileIds,
        });
      },
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map(id => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: 'recents',
      };

      return (
        <Card
          key={id}
          identifier={identifier}
          context={context}
          dimensions={{
            width: 200,
            height: 150,
          }}
        />
      );
    });

    return (
      <CardsWrapper>
        <h1>Cards</h1>
        {cards}
      </CardsWrapper>
    );
  }

  fetchNextPage = () => {
    console.log('fetchNextPage');
  };

  renderHeader = () => {
    return (
      <div>
        <Button appearance="primary" onClick={this.fetchNextPage}>
          Fetch next page
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderCards()}
      </div>
    );
  }
}

export default () => (
  <div>
    <Example />
  </div>
);
