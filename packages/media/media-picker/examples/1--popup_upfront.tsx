import * as React from 'react';
import { Component } from 'react';
import { ContextFactory } from '@atlaskit/media-core';
import Button from '@atlaskit/button';
import {
  userAuthProvider,
  mediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
  userAuthProviderBaseURL,
  createStorybookContext,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { MediaPicker, Popup } from '../src';
import {
  PopupContainer,
  PopupHeader,
  CardsWrapper,
  CardItemWrapper,
} from '../example-helpers/styled';
import {
  UploadEndEventPayload,
  UploadsStartEventPayload,
} from '../src/domain/uploadEvent';

const mediaPickerContext = ContextFactory.create({
  serviceHost: userAuthProviderBaseURL,
  authProvider: mediaPickerAuthProvider(),
  userAuthProvider,
});
const cardContext = createStorybookContext();
// const cardContext = mediaPickerContext;

const useNewUploadService = true;
const popup = MediaPicker('popup', mediaPickerContext, {
  container: document.body,
  uploadParams: {
    collection: defaultMediaPickerCollectionName,
  },
  useNewUploadService,
});

popup.show();

export interface PopupWrapperState {
  files: Promise<string>[];
  uploadingFiles: Promise<string>[];
}

class PopupWrapper extends Component<{}, PopupWrapperState> {
  state: PopupWrapperState = {
    files: [],
    uploadingFiles: [],
  };

  componentDidMount() {
    this.createPopup();
  }

  componentWillUnmount() {
    popup.removeAllListeners();
  }

  private createPopup() {
    popup.on('uploads-start', this.onUploadsStart);
    popup.on('upload-end', this.onUploadEnd);
  }

  onUploadsStart = (data: UploadsStartEventPayload) => {
    // TODO: append files
    const { files } = this.state;
    const { files: newFiles } = data;
    const ids = newFiles.map(file => file.upfrontId);
    console.log('onUploadsStart', { ids });
    this.setState({
      uploadingFiles: ids,
      files: [...ids, ...files],
    });
  };

  onUploadEnd = (data: UploadEndEventPayload) => {
    const { uploadingFiles } = this.state;
    const { file } = data;
    const index = uploadingFiles.indexOf(file.upfrontId);

    if (index > -1) {
      uploadingFiles.splice(index, 1);

      this.setState({ uploadingFiles });
    }

    console.log('onUploadEnd', { data, index });
  };

  onShow = () => {
    // Populate cache in userAuthProvider.
    userAuthProvider();
    // Synchronously with next command tenantAuthProvider will be requested.
    popup.show().catch(console.error);
  };

  renderCards = () => {
    const { files } = this.state;
    const cards = files.map((id, key) => {
      console.log('renderCards', id);
      return (
        <CardItemWrapper key={key}>
          <Card
            context={cardContext}
            isLazy={false}
            identifier={{
              id,
              mediaItemType: 'file',
              collectionName: 'mediapicker-test',
              // collectionName: 'recents',
            }}
          />
        </CardItemWrapper>
      );
    });

    return <CardsWrapper>{cards}</CardsWrapper>;
  };

  render() {
    const { uploadingFiles } = this.state;
    const length = uploadingFiles.length;
    const isUploadFinished = !length;
    console.log({ isUploadFinished });
    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onShow}>
            Show
          </Button>
          <div>Upload finished: {`${isUploadFinished}`}</div>
          <div>Uploading files: {length}</div>
        </PopupHeader>
        {this.renderCards()}
      </PopupContainer>
    );
  }
}

export default () => <PopupWrapper />;
