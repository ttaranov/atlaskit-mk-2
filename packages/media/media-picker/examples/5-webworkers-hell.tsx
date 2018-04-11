/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
  defaultServiceHost,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { MediaPicker, Browser } from '../src';
import {
  DropzonePreviewsWrapper,
  PopupHeader,
  PopupContainer,
} from '../example-helpers/styled';
import { renderPreviewImage } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';
import { BrowserConfig } from '../src/components/browser';

export interface BrowserWrapperState {
  previewsData: any[];
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  browserComponents: Browser[];
  dropzoneContainer: HTMLDivElement;

  constructor(props) {
    super(props);

    this.state = {
      previewsData: [],
    };

    this.browserComponents = (Array(5) as any).fill().map(this.createBrowse);
  }

  createBrowse = () => {
    const context = ContextFactory.create({
      serviceHost: defaultServiceHost,
      authProvider: mediaPickerAuthProvider(this),
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

  onOpen = fileBrowser => () => {
    fileBrowser.browse();
  };

  renderPreviews() {
    const { previewsData } = this.state;

    return previewsData.map(renderPreviewImage);
  }

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
        <DropzonePreviewsWrapper>
          <h1>Upload previews</h1>
          {this.renderPreviews()}
        </DropzonePreviewsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
