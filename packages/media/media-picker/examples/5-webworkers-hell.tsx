/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { MediaPicker, Browser, BrowserConfig } from '../src';
import {
  PreviewsWrapper,
  PopupHeader,
  PopupContainer,
  PreviewsTitle,
} from '../example-helpers/styled';
import { UploadPreview } from '../example-helpers/upload-preview';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  previewsData: any[];
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  browserComponents: Browser[];
  dropzoneContainer?: HTMLDivElement;

  constructor() {
    super({});
    this.state = {
      previewsData: [],
    };
    this.browserComponents = (Array(5) as any).fill().map(this.createBrowse);
  }

  createBrowse = () => {
    const context = ContextFactory.create({
      authProvider: mediaPickerAuthProvider(),
    });

    const browseConfig: BrowserConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png'],
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
    };
    const fileBrowser = MediaPicker('browser', context, browseConfig);

    fileBrowser.on('upload-preview-update', data => {
      this.setState({ previewsData: [...this.state.previewsData, data] });
    });

    return fileBrowser;
  };

  onOpen = (fileBrowser: Browser) => () => {
    fileBrowser.browse();
  };

  private renderPreviews = () => {
    const { previewsData } = this.state;

    return previewsData.map((previewsData, index) => (
      <UploadPreview key={`${index}`} fileId={previewsData.fileId} />
    ));
  };

  render() {
    const buttons = this.browserComponents.map((browser, key) => {
      return (
        <Button key={key} appearance="primary" onClick={this.onOpen(browser)}>
          Open
        </Button>
      );
    });

    return (
      <PopupContainer>
        <PopupHeader>{buttons}</PopupHeader>
        <PreviewsWrapper>
          <PreviewsTitle>Upload previews</PreviewsTitle>
          {this.renderPreviews()}
        </PreviewsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
