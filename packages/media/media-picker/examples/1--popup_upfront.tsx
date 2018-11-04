/**
 * The purpose of this example is to demo the integration between MediaPicker + id upfront + <Card />
 */

import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import {
  userAuthProvider,
  defaultMediaPickerCollectionName,
  createUploadContext,
} from '@atlaskit/media-test-helpers';
import { Card } from '@atlaskit/media-card';
import { MediaPicker } from '../src';
import {
  PopupContainer,
  PopupHeader,
  CardsWrapper,
  CardItemWrapper,
} from '../example-helpers/styled';
import {
  UploadEndEventPayload,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
} from '../src/domain/uploadEvent';

const context = createUploadContext();
const popup = MediaPicker('popup', context, {
  container: document.body,
  uploadParams: {
    collection: defaultMediaPickerCollectionName,
  },
});

popup.on('upload-preview-update', (event: UploadPreviewUpdateEventPayload) => {
  const { file, preview } = event;

  console.log('upload-preview-update file', file);
  console.log('upload-preview-update preview', preview);
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
    const { files } = this.state;
    const { files: newFiles } = data;
    const ids = newFiles.map(file => file.upfrontId);

    this.setState({
      uploadingFiles: ids,
      files: [...files, ...ids],
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
  };

  onShow = () => {
    // Populate cache in userAuthProvider.
    userAuthProvider();
    // Synchronously with next command tenantAuthProvider will be requested.
    popup.show().catch(console.error);
  };

  renderCards = () => {
    const { files } = this.state;
    const cards = files.map((upfrontId, key) => {
      upfrontId.then(id => {
        console.log(`<Card id="${id}" />`);
      });

      return (
        <CardItemWrapper key={key}>
          <Card
            context={context}
            isLazy={false}
            identifier={{
              id: upfrontId,
              mediaItemType: 'file',
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
