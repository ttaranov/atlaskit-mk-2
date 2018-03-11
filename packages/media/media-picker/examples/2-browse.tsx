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
import Toggle from '@atlaskit/toggle';
import { MediaPicker, Browser } from '../src';
import {
  DropzonePreviewsWrapper,
  PopupHeader,
  PopupContainer,
} from '../example-helpers/styled';
import { renderPreviewImage } from '../example-helpers';
import { AuthEnvironment } from '../example-helpers';

export interface BrowserWrapperState {
  isAutoFinalizeActive: boolean;
  isFetchMetadataActive: boolean;
  collectionName: string;
  finalizeCallbacks: any[];
  previewsData: any[];
  authEnvironment: AuthEnvironment;
}

class BrowserWrapper extends Component<{}, BrowserWrapperState> {
  fileBrowser: Browser;
  dropzoneContainer: HTMLDivElement;

  state: BrowserWrapperState = {
    isAutoFinalizeActive: true,
    isFetchMetadataActive: true,
    finalizeCallbacks: [],
    previewsData: [],
    authEnvironment: 'client',
    collectionName: defaultMediaPickerCollectionName,
  };

  componentDidMount() {
    this.createBrowse();
  }

  createBrowse() {
    const uploadParams = {
      autoFinalize: true,
      collection: defaultMediaPickerCollectionName,
      authMethod: 'client',
    };
    const config = {
      apiUrl: defaultServiceHost,
      authProvider: mediaPickerAuthProvider(this),
      uploadParams,
    };
    const browseConfig = {
      multiple: true,
      fileExtensions: ['image/jpeg', 'image/png'],
    };
    const fileBrowser = MediaPicker('browser', config, browseConfig);

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

    fileBrowser.on('upload-finalize-ready', data => {
      console.log('upload finalize ready:', data);
      const { finalizeCallbacks } = this.state;

      this.setState({
        finalizeCallbacks: [...finalizeCallbacks, data.finalize],
      });
    });

    fileBrowser.on('upload-end', data => {
      console.log('upload end:', data);
    });

    fileBrowser.on('upload-error', data => {
      console.log('upload error:', data);
    });
  }

  onAutoFinalizeChange = () => {
    const { collectionName: collection, isAutoFinalizeActive } = this.state;

    this.setState({ isAutoFinalizeActive: !isAutoFinalizeActive }, () => {
      const { isAutoFinalizeActive, isFetchMetadataActive } = this.state;
      this.fileBrowser.setUploadParams({
        collection,
        autoFinalize: isAutoFinalizeActive,
        fetchMetadata: isFetchMetadataActive,
      });
    });
  };

  onFetchMetadataChange = () => {
    this.setState(
      { isFetchMetadataActive: !this.state.isFetchMetadataActive },
      () => {
        const {
          isAutoFinalizeActive,
          collectionName: collection,
          isFetchMetadataActive,
        } = this.state;
        this.fileBrowser.setUploadParams({
          collection,
          autoFinalize: isAutoFinalizeActive,
          fetchMetadata: isFetchMetadataActive,
        });
      },
    );
  };

  onOpen = () => {
    this.fileBrowser.browse();
  };

  onFinalize = () => {
    const { finalizeCallbacks } = this.state;

    finalizeCallbacks.forEach(cb => cb());

    this.setState({ finalizeCallbacks: [], isAutoFinalizeActive: false });
  };

  onCollectionChange = e => {
    const { innerText: collectionName } = e.target;

    this.setState({ collectionName }, () => {
      const { isAutoFinalizeActive, isFetchMetadataActive } = this.state;
      this.fileBrowser.setUploadParams({
        collection: collectionName,
        autoFinalize: isAutoFinalizeActive,
        fetchMetadata: isFetchMetadataActive,
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
    const {
      isAutoFinalizeActive,
      isFetchMetadataActive,
      collectionName,
      authEnvironment,
      finalizeCallbacks,
    } = this.state;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onOpen}>
            Open
          </Button>
          <Button
            appearance="primary"
            onClick={this.onFinalize}
            isDisabled={finalizeCallbacks.length === 0}
          >
            Finalize
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
          autoFinalize
          <Toggle
            isDefaultChecked={isAutoFinalizeActive}
            onChange={this.onAutoFinalizeChange}
          />
          fetchMetadata
          <Toggle
            isDefaultChecked={isFetchMetadataActive}
            onChange={this.onFetchMetadataChange}
          />
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
