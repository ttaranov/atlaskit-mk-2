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
import { MediaPicker, Dropzone, UploadPreviewUpdateEventPayload } from '../src';
import {
  DropzoneContainer,
  PopupHeader,
  PopupContainer,
  DropzoneContentWrapper,
  DropzonePreviewsWrapper,
  DropzoneItemsInfo,
} from '../example-helpers/styled';
import { PreviewData, renderPreviewImage } from '../example-helpers';
import { ModuleConfig } from '../src/domain/config';

export interface DropzoneWrapperState {
  isConnectedToUsersCollection: boolean;
  previewsData: PreviewData[];
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

  // TODO Extract to one place
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

  createDropzone() {
    const { isConnectedToUsersCollection } = this.state;
    const config: ModuleConfig = {
      authProvider: defaultMediaPickerAuthProvider,
      apiUrl: userAuthProviderBaseURL,
    };
    const dropzone = MediaPicker('dropzone', config, {
      container: this.dropzoneContainer,
      userAuthProvider: isConnectedToUsersCollection
        ? userAuthProvider
        : undefined,
    });

    this.dropzone = dropzone;

    dropzone.on('uploads-start', data => {
      console.log('uploads-start');
      const newInflightUploads = data.files.map(file => file.id);

      this.setState({
        inflightUploads: [...this.state.inflightUploads, ...newInflightUploads],
      });
    });

    dropzone.on(
      'upload-preview-update',
      (payload: UploadPreviewUpdateEventPayload) => {
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

    dropzone.on('upload-status-update', ({ file: { id }, progress }) => {
      let uploadProgress = Math.round(progress.portion * 98);
      console.log(`upload progress: ${uploadProgress}% for ${id} file`);
      this.updatePreviewDataFile(id, uploadProgress);
    });

    dropzone.on('upload-processing', ({ file: { id } }) => {
      console.log('file processing');
      // TODO inflightUploads could be replaces with previews
      const inflightUploads = this.state.inflightUploads.filter(
        fileId => fileId !== id,
      );

      this.setState({ inflightUploads });
      this.updatePreviewDataFile(id, 99);
    });

    dropzone.on('upload-end', ({ file: { id, publicId } }) => {
      console.log(`upload end for ${publicId} (local id: ${id}) file`);
      this.updatePreviewDataFile(id, 100);

      setTimeout(() => {
        this.updatePreviewDataFile(id, 100, true);
      }, 700);
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

  saveDropzoneContainer = element => {
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
