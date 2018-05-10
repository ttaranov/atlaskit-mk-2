/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  userAuthProvider,
  defaultMediaPickerAuthProvider,
  userAuthProviderBaseURL,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import Toggle from '@atlaskit/toggle';
import Spinner from '@atlaskit/spinner';
import { MediaPicker, Dropzone } from '../src';
import {
  DropzoneContainer,
  PopupHeader,
  PopupContainer,
  DropzoneContentWrapper,
  DropzonePreviewsWrapper,
  DropzoneItemsInfo,
} from '../example-helpers/styled';
import { renderPreviewImage } from '../example-helpers';
import { ContextFactory } from '@atlaskit/media-core';

export interface DropzoneWrapperState {
  isConnectedToUsersCollection: boolean;
  previewsData: any[];
  isActive: boolean;
  isFetchingLastItems: boolean;
  lastItems: any[];
  inflightUploads: string[];
}

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
  dropzone: Dropzone;
  dropzoneContainer: HTMLDivElement;

  state: DropzoneWrapperState = {
    isConnectedToUsersCollection: true,
    previewsData: [],
    isActive: true,
    isFetchingLastItems: true,
    lastItems: [],
    inflightUploads: [],
  };

  // TODO: Move into example-helpers
  fetchLastItems() {
    this.setState({ isFetchingLastItems: true });

    userAuthProvider()
      .then(({ clientId, token }) => {
        const queryParams = `client=${clientId}&token=${token}&limit=5&details=full&sortDirection=desc`;
        return fetch(
          `${userAuthProviderBaseURL}/collection/recents/items?${queryParams}`,
        );
      })
      .then(r => r.json())
      .then(data => {
        const lastItems = data.data.contents;
        this.setState({
          lastItems,
          isFetchingLastItems: false,
        });
      });
  }

  createDropzone() {
    const { isConnectedToUsersCollection } = this.state;
    const context = ContextFactory.create({
      serviceHost: userAuthProviderBaseURL,
      authProvider: defaultMediaPickerAuthProvider,
      userAuthProvider: isConnectedToUsersCollection
        ? userAuthProvider
        : undefined,
    });
    const dropzone = MediaPicker('dropzone', context, {
      container: this.dropzoneContainer,
      uploadParams: {
        collection: '',
      },
    });

    this.dropzone = dropzone;

    dropzone.on('uploads-start', data => {
      console.log('uploads-start');
      const newInflightUploads = data.files.map(file => file.id);

      this.setState({
        inflightUploads: [...this.state.inflightUploads, ...newInflightUploads],
      });
    });

    dropzone.on('upload-preview-update', data => {
      this.setState({ previewsData: [...this.state.previewsData, data] });
    });

    dropzone.on('upload-status-update', data => {
      console.log('upload progress update');
      console.log(data);
    });

    dropzone.on('upload-processing', data => {
      console.log('file processing');
      const processingFileId = data.file.id;
      const inflightUploads = this.state.inflightUploads.filter(
        fileId => fileId !== processingFileId,
      );

      this.setState({ inflightUploads });
    });

    dropzone.on('upload-end', data => {
      console.log('upload finished');
      console.log(data);
    });

    dropzone.on('drag-enter', data => {
      console.log('drag-enter', data.length, data);
    });

    dropzone.on('drag-leave', () => {
      console.log('drag-leave');
    });

    dropzone.on('drop', () => {
      console.log('drop');
    });

    dropzone.activate();
  }

  saveDropzoneContainer = (element: HTMLDivElement) => {
    this.dropzoneContainer = element;

    this.createDropzone();
    this.fetchLastItems();
  };

  renderPreviews = () => {
    const { previewsData } = this.state;

    return previewsData.map(renderPreviewImage);
  };

  onConnectionChange = () => {
    const isConnectedToUsersCollection = !this.state
      .isConnectedToUsersCollection;
    this.setState({ isConnectedToUsersCollection }, () => {
      this.dropzone.deactivate();
      this.createDropzone();
    });
  };

  onActiveChange = () => {
    const { dropzone } = this;
    const isActive = !this.state.isActive;
    this.setState({ isActive }, () => {
      isActive ? dropzone.activate() : dropzone.deactivate();
    });
  };

  onCancel = () => {
    const { inflightUploads } = this.state;

    inflightUploads.forEach(uploadId => this.dropzone.cancel(uploadId));

    this.setState({ inflightUploads: [] });
  };

  renderLastItems = () => {
    const { isFetchingLastItems, lastItems } = this.state;

    if (isFetchingLastItems) {
      return <Spinner size="large" />;
    }

    return lastItems.map((item, key) => {
      return (
        <div key={key}>
          {item.id} | {item.details.name} | {item.details.mediaType}
        </div>
      );
    });
  };

  onFetchLastItems = () => {
    this.fetchLastItems();
  };

  render() {
    const {
      isConnectedToUsersCollection,
      isActive,
      inflightUploads,
    } = this.state;
    const isCancelButtonDisabled = inflightUploads.length === 0;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button appearance="primary" onClick={this.onFetchLastItems}>
            Fetch last items
          </Button>
          <Button
            appearance="danger"
            onClick={this.onCancel}
            isDisabled={isCancelButtonDisabled}
          >
            Cancel uploads
          </Button>
          Connected to users collection
          <Toggle
            isDefaultChecked={isConnectedToUsersCollection}
            onChange={this.onConnectionChange}
          />
          Active
          <Toggle isDefaultChecked={isActive} onChange={this.onActiveChange} />
        </PopupHeader>
        <DropzoneContentWrapper>
          <DropzoneContainer
            isActive={isActive}
            innerRef={this.saveDropzoneContainer}
          />
          <DropzoneItemsInfo>
            <h1>User collection items</h1>
            {this.renderLastItems()}
          </DropzoneItemsInfo>
          <DropzonePreviewsWrapper>
            <h1>Upload previews</h1>
            {this.renderPreviews()}
          </DropzonePreviewsWrapper>
        </DropzoneContentWrapper>
      </PopupContainer>
    );
  }
}

export default () => <DropzoneWrapper />;
