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
  DropzoneItemsInfo,
} from '../example-helpers/styled';
import { PreviewsData } from '../example-helpers/previews-data';
import { ContextFactory } from '@atlaskit/media-core';

export interface DropzoneWrapperState {
  isConnectedToUsersCollection: boolean;
  isActive: boolean;
  isFetchingLastItems: boolean;
  lastItems: any[];
  inflightUploads: string[];
  pickerVersion: number;
}

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
  dropzone: Dropzone;
  dropzoneContainer: HTMLDivElement;

  state: DropzoneWrapperState = {
    isConnectedToUsersCollection: true,
    isActive: true,
    isFetchingLastItems: true,
    lastItems: [],
    inflightUploads: [],
    pickerVersion: 1,
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
      useNewUploadService: true,
    });

    this.dropzone = dropzone;
    dropzone.activate();

    this.setState(prevState => ({
      pickerVersion: prevState.pickerVersion + 1,
    }));
  }

  saveDropzoneContainer = (element: HTMLDivElement) => {
    this.dropzoneContainer = element;

    this.createDropzone();
    this.fetchLastItems();
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
            {this.dropzone ? <PreviewsData picker={this.dropzone} /> : null}
            <h1>User collection items</h1>
            {this.renderLastItems()}
          </DropzoneItemsInfo>
        </DropzoneContentWrapper>
      </PopupContainer>
    );
  }
}

export default () => <DropzoneWrapper />;
