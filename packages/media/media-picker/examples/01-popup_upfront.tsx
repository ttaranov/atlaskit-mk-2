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
  FilesInfoWrapper,
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
// const cardContext = createStorybookContext();
const cardContext = mediaPickerContext;
export interface PopupWrapperState {
  files: Promise<string>[];
  popup?: Popup;
}

class PopupWrapper extends Component<{}, PopupWrapperState> {
  state: PopupWrapperState = {
    files: [],
  };

  componentDidMount() {
    this.createPopup();
  }

  componentWillUnmount() {
    const { popup } = this.state;
    if (popup) {
      popup.removeAllListeners();
    }
  }

  private createPopup() {
    const { popup } = this.state;
    const useNewUploadService = true;
    if (popup) {
      popup.removeAllListeners();
      popup.teardown();
    }

    const newPopup = MediaPicker('popup', mediaPickerContext, {
      container: document.body,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
      useNewUploadService,
    });

    newPopup.on('uploads-start', this.onUploadsStart);
    newPopup.on('upload-end', this.onUploadEnd);

    this.setState({
      popup: newPopup,
    });
  }

  onUploadsStart = (data: UploadsStartEventPayload) => {
    // TODO: append files
    const { files } = this.state;
    const { files: newFiles } = data;
    const ids = newFiles.map(file => file.upfrontId);

    this.setState({
      files: [...ids, ...files],
    });
  };

  onUploadEnd = (data: UploadEndEventPayload) => {
    // TODO: Fake enabling of button
  };

  onShow = () => {
    const { popup } = this.state;

    if (popup) {
      // Populate cache in userAuthProvider.
      userAuthProvider();
      // Synchronously with next command tenantAuthProvider will be requested.
      popup.show().catch(console.error);
    }
  };

  renderCards = () => {
    const { files } = this.state;
    const cards = files.map((id, key) => (
      <CardItemWrapper key={key}>
        <Card
          context={cardContext}
          isLazy={false}
          identifier={{
            id,
            mediaItemType: 'file',
            collectionName: 'recents',
          }}
        />
      </CardItemWrapper>
    ));

    return <CardsWrapper>{cards}</CardsWrapper>;
  };

  render() {
    const { popup } = this.state;
    const hasTorndown = !popup;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button
            appearance="primary"
            onClick={this.onShow}
            isDisabled={hasTorndown}
          >
            Show
          </Button>
        </PopupHeader>
        <FilesInfoWrapper>{this.renderCards()}</FilesInfoWrapper>
      </PopupContainer>
    );
  }
}

export default () => <PopupWrapper />;
