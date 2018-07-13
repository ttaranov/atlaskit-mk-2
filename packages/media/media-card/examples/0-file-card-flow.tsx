/* tslint:disable:no-console */
import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  defaultCollectionName,
  genericFileId,
  createUploadContext,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { Card, FileIdentifier, OnLoadingChangeState } from '../src';
import { UploadController, FileState } from '@atlaskit/media-core';
import { Observable } from 'rxjs';
import {
  CardWrapper,
  CardFlowHeader,
  CardsWrapper,
  CardState,
} from '../example-helpers/styled';

const context = createUploadContext();

export interface ComponentProps {}
export interface ComponentState {
  fileIds: string[];
  cardStates: { [name: string]: OnLoadingChangeState | undefined };
}

class Example extends Component<ComponentProps, ComponentState> {
  uploadController?: UploadController;
  state: ComponentState = {
    fileIds: [genericFileId.id],
    cardStates: {},
  };

  renderCards() {
    const { fileIds, cardStates } = this.state;
    const cards = fileIds.map(id => {
      const state = cardStates[id];
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
      };

      return (
        <CardWrapper key={id}>
          {/* <CardTitle>{id}</CardTitle> */}
          <Card
            context={context}
            identifier={identifier}
            onLoadingChange={this.onLoadingChange(id)}
          />
          {this.renderCardState(state)}
        </CardWrapper>
      );
    });

    return <CardsWrapper>{cards}</CardsWrapper>;
  }

  renderCardState = (state?: OnLoadingChangeState) => {
    if (!state) {
      return;
    }

    return (
      <CardState>
        <div>Type: {state.type}</div>
        <pre>{JSON.stringify(state.payload, undefined, 2)}</pre>
      </CardState>
    );
  };

  onLoadingChange = (id: string) => (state: OnLoadingChangeState) => {
    const { cardStates } = this.state;

    cardStates[id] = state;

    this.setState({
      cardStates,
    });
  };

  cancelUpload = () => {
    if (this.uploadController) {
      this.uploadController.abort();
    }
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) {
      return;
    }

    const file = event.currentTarget.files[0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    };
    const uploadController = new UploadController();
    const stream = context.uploadFile(uplodableFile, uploadController);

    this.uploadController = uploadController;
    this.addStream(stream);
  };

  addStream = (stream: Observable<FileState>) => {
    let isIdSaved = false;

    const subscription = stream.subscribe({
      next: state => {
        const { fileIds } = this.state;

        if (!isIdSaved && state.status === 'uploading') {
          isIdSaved = true;
          this.setState({
            fileIds: [...fileIds, state.id],
          });
        }

        if (state.status === 'processing') {
          // here we have the public id, AKA upload is finished
          console.log('public id', state.id);
          subscription.unsubscribe();
        }
      },
      complete() {
        console.log('stream complete');
      },
      error(error) {
        console.log('stream error', error);
      },
    });
  };

  render() {
    return (
      <div>
        <CardFlowHeader>
          Upload file <input type="file" onChange={this.uploadFile} />
          <Button appearance="primary" onClick={this.cancelUpload}>
            Cancel upload
          </Button>
        </CardFlowHeader>
        {this.renderCards()}
      </div>
    );
  }
}

export default () => <Example />;
