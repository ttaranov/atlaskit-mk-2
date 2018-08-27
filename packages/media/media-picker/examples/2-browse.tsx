/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  mediaPickerAuthProvider,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import Toggle from '@atlaskit/toggle';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { MediaPicker, Browser, UploadParams, BrowserConfig } from '../src';
import { PopupHeader, PopupContainer } from '../example-helpers/styled';
import { UploadPreviews } from '../example-helpers/upload-previews';
import { AuthEnvironment } from '../example-helpers/types';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  useNewUploadService: boolean;
  authEnvironment: AuthEnvironment;
  fileBrowser?: Browser;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  dropzoneContainer: HTMLDivElement;

  state: BrowserWrapperState = {
    useNewUploadService: true,
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentWillMount() {
    this.createBrowse();
  }

  createBrowse(useNewUploadService: boolean = this.state.useNewUploadService) {
    const context = ContextFactory.create({
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
    if (this.state.fileBrowser) {
      this.state.fileBrowser.teardown();
    }
    const fileBrowser = MediaPicker('browser', context, browseConfig);

    this.setState({
      fileBrowser,
      useNewUploadService,
    });
  }

  onOpen = () => {
    const { fileBrowser } = this.state;
    if (fileBrowser) {
      fileBrowser.browse();
    }
  };

  onCollectionChange = e => {
    const { innerText: collectionName } = e.target;
    const { fileBrowser } = this.state;
    if (!fileBrowser) {
      return;
    }

    this.setState({ collectionName }, () => {
      fileBrowser.setUploadParams({
        collection: collectionName,
      });
    });
  };

  onAuthTypeChange = e => {
    const { innerText: authEnvironment } = e.target;

    this.setState({ authEnvironment });
  };

  onUseNewUploadServiceChange = () => {
    this.createBrowse(!this.state.useNewUploadService);
  };

  render() {
    const {
      collectionName,
      authEnvironment,
      useNewUploadService,
      fileBrowser,
    } = this.state;

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
            onChange={this.onUseNewUploadServiceChange}
          />
        </PopupHeader>
        {fileBrowser ? <UploadPreviews picker={fileBrowser} /> : null}
      </PopupContainer>
    );
  }
}

export default () => <BrowserWrapper />;
