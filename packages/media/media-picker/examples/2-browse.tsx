/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  defaultServiceHost,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { MediaPicker, Browser, UploadParams } from '../src';
import {
  DropzonePreviewsWrapper,
  PopupHeader,
  PopupContainer,
} from '../example-helpers/styled';
import { renderPreviewImage } from '../example-helpers';
import { AuthEnvironment } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  previewsData: any[];
  authEnvironment: AuthEnvironment;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  fileBrowser: Browser;
  dropzoneContainer: HTMLDivElement;

  state: BrowserWrapperState = {
    previewsData: [],
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentDidMount() {
    this.createBrowse();
  }

  createBrowse() {
    const context = ContextFactory.create({
      serviceHost: defaultServiceHost,
      authProvider: mediaPickerAuthProvider(this),
    });
    const uploadParams: UploadParams = {
      collection: defaultMediaPickerCollectionName,
    };
    const browseConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png'],
      uploadParams,
    };
    const fileBrowser = MediaPicker('browser', context, browseConfig);

    this.fileBrowser = fileBrowser;

    fileBrowser.on('uploads-start', data => {
      console.log('uploads-start:', data);
    });

    fileBrowser.on('upload-preview-update', data => {
      this.setState({ previewsData: [...this.state.previewsData, data] });
    });

    fileBrowser.on('upload-status-update', data => {
      console.log('upload progress:', data.progress.portion + '%');
    });

    fileBrowser.on('upload-end', data => {
      console.log('upload end:', data);
    });

    fileBrowser.on('upload-error', data => {
      console.log('upload error:', data);
    });
  }

  onOpen = () => {
    this.fileBrowser.browse();
  };

  onCollectionChange = e => {
    const { innerText: collectionName } = e.target;

    this.setState({ collectionName }, () => {
      this.fileBrowser.setUploadParams({
        collection: collectionName,
      });
    });
  };

  onAuthTypeChange = e => {
    const { innerText: authEnvironment } = e.target;

    this.setState({ authEnvironment });
  };

  renderPreviews() {
    const { previewsData } = this.state;

    return previewsData.map(renderPreviewImage);
  }

  render() {
    const { collectionName, authEnvironment } = this.state;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onOpen}>
            Open
          </Button>
          <DropdownMenu trigger={collectionName} triggerType="button">
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultMediaPickerCollectionName}
            </DropdownItem>
            <DropdownItem onClick={this.onCollectionChange}>
              {defaultCollectionName}
            </DropdownItem>
          </DropdownMenu>
          <DropdownMenu trigger={authEnvironment} triggerType="button">
            <DropdownItem onClick={this.onAuthTypeChange}>client</DropdownItem>
            <DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>
          </DropdownMenu>
        </PopupHeader>
        <DropzonePreviewsWrapper>
          <h1>Upload previews</h1>
          {this.renderPreviews()}
        </DropzonePreviewsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
