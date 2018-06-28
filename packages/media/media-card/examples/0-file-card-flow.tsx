/* tslint:disable:no-console */
import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
  genericFileId,
  defaultServiceHost,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { Card, FileIdentifier } from '../src';
import {
  UploadController,
  FileState,
  ContextFactory,
} from '@atlaskit/media-core';
import { Observable } from 'rxjs';
import {
  CardTitle,
  CardWrapper,
  CardFlowHeader,
  CardsWrapper,
} from '../example-helpers/styled';

// const context = createStorybookContext();
const context = ContextFactory.create({
  serviceHost: defaultServiceHost,
  authProvider: mediaPickerAuthProvider('asap'),
});

export interface ComponentProps {}
export interface ComponentState {
  fileIds: string[];
}

class Example extends Component<ComponentProps, ComponentState> {
  uploadController?: UploadController;
  state: ComponentState = {
    fileIds: [genericFileId.id],
  };

  renderCards() {
    const { fileIds } = this.state;
    const cards = fileIds.map(id => {
      const identifier: FileIdentifier = {
        id,
        mediaItemType: 'file',
        collectionName: defaultCollectionName,
      };

      return (
        <CardWrapper key={id}>
          <CardTitle>{id}</CardTitle>
          <Card context={context} identifier={identifier} />
        </CardWrapper>
      );
    });

    return <CardsWrapper>{cards}</CardsWrapper>;
  }

  cancelUpload = () => {
    if (this.uploadController) {
      this.uploadController.cancel();
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
        console.log('state', state);
        const { fileIds } = this.state;

        if (!isIdSaved && state.status === 'uploading') {
          isIdSaved = true;
          this.setState({
            fileIds: [...fileIds, state.id],
          });
        }

        if (state.status === 'processing') {
          // TODO: here we have the public id, AKA upload is finished
          console.log('public id', state.id);
          subscription.unsubscribe();
        }

        // if (fileIds.indexOf(state.id) === -1) {

        // }
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
