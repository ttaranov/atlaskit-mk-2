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
import { MediaPicker, Browser, UploadPreviewUpdateEventPayload } from '../src';
import { ModuleConfig, UploadParams } from '../src/domain/config';
import {
  DropzonePreviewsWrapper,
  PopupHeader,
  PopupContainer,
} from '../example-helpers/styled';
import { PreviewData, renderPreviewImage } from '../example-helpers';
import { AuthEnvironment } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';

export interface BrowserWrapperState {
  collectionName: string;
  previewsData: PreviewData[];
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

  getPreviewData(fileId: string): PreviewData | null {
    return (
      this.state.previewsData.find(preview => preview.fileId === fileId) || null
    );
  }

  updatePreviewDataFile(
    fileId: string,
    progress: number,
    isProcessed: boolean = false,
  ) {
    const previewData = this.getPreviewData(fileId);
    if (
      previewData &&
      (previewData.uploadingProgress !== progress ||
        previewData.isProcessed !== isProcessed)
    ) {
      previewData.uploadingProgress = progress;
      previewData.isProcessed = isProcessed;
      this.forceUpdate();
    } else {
      console.log('update is not needed');
    }
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
      fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
      uploadParams,
    };
    const fileBrowser = MediaPicker('browser', context, browseConfig);

    this.fileBrowser = fileBrowser;

    fileBrowser.on('uploads-start', data => {
      console.log('uploads-start:', data);
    });

    fileBrowser.on(
      'upload-preview-update',
      (payload: UploadPreviewUpdateEventPayload) => {
        console.log('preview ready');
        const previewData: PreviewData = {
          preview: payload.preview,
          isProcessed: false,
          fileId: payload.file.id,
          uploadingProgress: 0,
        };
        this.setState({
          previewsData: [previewData, ...this.state.previewsData],
        });
      },
    );

    fileBrowser.on('upload-status-update', ({ file: { id }, progress }) => {
      let uploadProgress = Math.round(progress.portion * 98);
      console.log(`upload progress: ${uploadProgress}% for ${id} file`);
      this.updatePreviewDataFile(id, uploadProgress);
    });

    fileBrowser.on('upload-processing', ({ file: { id } }) => {
      console.log(`processing has started for ${id} file`);
      this.updatePreviewDataFile(id, 99);
    });

    fileBrowser.on('upload-end', ({ file: { id, publicId } }) => {
      console.log(`upload end for ${publicId} (local id: ${id}) file`);
      this.updatePreviewDataFile(id, 100);

      setTimeout(() => {
        this.updatePreviewDataFile(id, 100, true);
      }, 700);
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
