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
import Toggle from '@atlaskit/toggle';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { MediaPicker, Browser, UploadParams, BrowserConfig } from '../src';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import { PreviewsData } from '../example-helpers/previews-data';
import { AuthEnvironment } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  useNewUploadService: boolean;
  authEnvironment: AuthEnvironment;
  pickerVersion: number;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  fileBrowser: Browser;
  dropzoneContainer: HTMLDivElement;

  state: BrowserWrapperState = {
    useNewUploadService: true,
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
    pickerVersion: 1,
  };

  componentWillMount() {
    this.createBrowse();
  }

  createBrowse(useNewUploadService: boolean = this.state.useNewUploadService) {
    const context = ContextFactory.create({
      serviceHost: defaultServiceHost,
      authProvider: mediaPickerAuthProvider(),
    });
    const uploadParams: UploadParams = {
      collection: defaultMediaPickerCollectionName,
    };
    const browseConfig: BrowserConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
      uploadParams,
      useNewUploadService,
    };
    if (this.fileBrowser) {
      this.fileBrowser.teardown();
    }
    this.fileBrowser = MediaPicker('browser', context, browseConfig);

    this.setState(prevState => ({
      pickerVersion: prevState.pickerVersion + 1,
      useNewUploadService,
    }));
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

  onuseNewUploadServiceChange = () => {
    this.createBrowse(!this.state.useNewUploadService);
  };

  render() {
    const { collectionName, authEnvironment, useNewUploadService } = this.state;

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
          Use new upload service
          <Toggle
            isDefaultChecked={useNewUploadService}
            onChange={this.onuseNewUploadServiceChange}
          />
        </PopupHeader>
        <PreviewsData picker={this.fileBrowser} />
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
