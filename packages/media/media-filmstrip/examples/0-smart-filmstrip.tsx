/* tslint:disable variable-name */
import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  createUploadContext,
  genericFileId,
  audioFileId,
  errorFileId,
  gifFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { Filmstrip, FilmstripItem } from '../src';
import { ExampleWrapper, FilmstripWrapper } from '../example-helpers/styled';
import {
  CardEvent,
  FileIdentifier,
} from '../node_modules/@atlaskit/media-card';

export interface ExampleState {
  items: FilmstripItem[];
}

const context = createUploadContext();

class Example extends Component<any, ExampleState> {
  onCardClick = (result: CardEvent) => {
    const { items } = this.state;

    if (!result.mediaItemDetails) {
      return;
    }
    const selectedId = (result.mediaItemDetails as FileIdentifier).id;
    const item = items.find(
      item => (item.identifier as FileIdentifier).id === selectedId,
    );

    if (item) {
      const newItem = {
        ...item,
        selected: !item.selected,
      };
      const currentItemIndex = items.indexOf(item);
      items[currentItemIndex] = newItem;

      this.setState({
        items,
      });
    }
  };

  // TODO: pass delete action
  cardProps: Partial<FilmstripItem> = {
    selectable: true,
    onClick: this.onCardClick,
  };

  state: ExampleState = {
    items: [
      {
        identifier: genericFileId,
        ...this.cardProps,
      },
      {
        identifier: audioFileId,
        ...this.cardProps,
      },
      {
        identifier: errorFileId,
        ...this.cardProps,
      },
      {
        identifier: gifFileId,
        ...this.cardProps,
      },
    ],
  };

  createOnClickFromId = (id: string) => (event: any) => {
    this.onCardClick({
      event,
      mediaItemDetails: {
        id,
      },
    });
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || !event.currentTarget.files.length) {
      return;
    }

    const file = event.currentTarget.files[0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    };
    const stream = context.uploadFile(uplodableFile);

    stream.first().subscribe({
      next: state => {
        if (state.status === 'uploading') {
          const { id } = state;
          const { items } = this.state;
          const newItem: FilmstripItem = {
            ...this.cardProps,
            onClick: this.createOnClickFromId(id),
            identifier: {
              id,
              mediaItemType: 'file',
              collectionName: defaultCollectionName,
            },
            selected: true,
          };

          this.setState({
            items: [newItem, ...items],
          });
        }
      },
      error(error) {
        console.log('subscription', error);
      },
    });
  };

  render() {
    const { items } = this.state;

    return (
      <ExampleWrapper>
        <FilmstripWrapper>
          <Filmstrip context={context} items={items} />
        </FilmstripWrapper>
        Upload file <input type="file" onChange={this.uploadFile} />
      </ExampleWrapper>
    );
  }
}

export default () => <Example />;
