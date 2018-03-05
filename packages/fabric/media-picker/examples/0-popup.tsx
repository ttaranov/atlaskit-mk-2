/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import Toggle from '@atlaskit/toggle';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import {
  userAuthProvider,
  mediaPickerAuthProvider,
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  userAuthProviderBaseURL,
} from '@atlaskit/media-test-helpers';
import { MediaPicker, Popup, MediaProgress } from '../src';
import {
  PopupContainer,
  PopupHeader,
  PopupEventsWrapper,
  PreviewImage,
  UploadingFilesWrapper,
  FileProgress,
} from '../example-helpers/styled';
import { AuthEnvironment } from '../example-helpers';

export type InflightUpload = { [key: string]: {} };
export interface PopupWrapperState {
  isAutoFinalizeActive: boolean;
  isFetchMetadataActive: boolean;
  collectionName: string;
  closedTimes: number;
  events: any[];
  authEnvironment: AuthEnvironment;
  inflightUploads: { [key: string]: MediaProgress };
  hasTorndown: boolean;
}

class PopupWrapper extends Component<{}, PopupWrapperState> {
  popup: Popup;

  state: PopupWrapperState = {
    isAutoFinalizeActive: true,
    isFetchMetadataActive: true,
    collectionName: defaultMediaPickerCollectionName,
    closedTimes: 0,
    events: [],
    authEnvironment: 'client',
    inflightUploads: {},
    hasTorndown: false,
  };

  componentDidMount() {
    const config = {
      authProvider: mediaPickerAuthProvider(this),
      apiUrl: userAuthProviderBaseURL,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
    };

    this.popup = MediaPicker('popup', config, {
      container: document.body,
      userAuthProvider,
    });

    this.popup.onAny(this.onPopupEvent);
  }

  componentWillUnmount() {
    this.popup.removeAllListeners();
  }

  onPopupEvent = (eventName, data) => {
    if (eventName === 'upload-error') {
      if (data.error.name === 'user_token_fetch_fail') {
        const authStg = confirm(
          'It looks like you are not authorized in Staging. Press OK to authorize',
        );
        authStg
          ? window.open('https://id.stg.internal.atlassian.com', '_blank')
          : this.popup.hide();
      } else {
        console.error(JSON.stringify(data));
      }
      return;
    }

    if (eventName === 'closed') {
      this.setState({ closedTimes: this.state.closedTimes + 1 });
      return;
    }

    if (eventName === 'uploads-start') {
      const newInflightUploads = data.files.reduce((prev, { id }) => {
        prev[id] = {};

        return prev;
      }, {});

      this.setState({
        inflightUploads: {
          ...this.state.inflightUploads,
          ...newInflightUploads,
        },
      });
    }

    if (eventName === 'upload-status-update') {
      const { inflightUploads } = this.state;
      const id = data.file.id;
      inflightUploads[id] = data.progress;
      this.setState({ inflightUploads });
    }

    this.setState({
      events: [...this.state.events, { eventName, data }],
    });
  };

  onShow = () => {
    const {
      isAutoFinalizeActive,
      isFetchMetadataActive,
      collectionName: collection,
    } = this.state;

    this.popup.setUploadParams({
      collection,
      autoFinalize: isAutoFinalizeActive,
      fetchMetadata: isFetchMetadataActive,
    });

    this.popup.show().catch(console.error);
  };

  onAutoFinalizeChange = () => {
    this.setState({ isAutoFinalizeActive: !this.state.isAutoFinalizeActive });
  };

  onFetchMetadataChange = () => {
    this.setState({ isFetchMetadataActive: !this.state.isFetchMetadataActive });
  };

  onCollectionChange = e => {
    const { innerText: collectionName } = e.target;

    this.setState({ collectionName });
  };

  onAuthTypeChange = e => {
    const { innerText: authEnvironment } = e.target;

    this.setState({ authEnvironment });
  };

  renderSerializedEvent(eventName, data, key) {
    const serializedEvent = JSON.stringify(data, undefined, 2);

    return (
      <div key={key}>
        {eventName} :&nbsp;
        <pre> {serializedEvent} </pre>
      </div>
    );
  }

  renderEvents(events) {
    return events.map(({ eventName, data }, key) => {
      if (eventName === 'uploads-start') {
        return (
          <div key={key}>
            <div>
              <h2>Upload has started for {data.files.length} files</h2>
            </div>
            {this.renderSerializedEvent(eventName, data, key)}
          </div>
        );
      }

      if (eventName === 'upload-preview-update') {
        if (!data.preview) {
          return;
        }

        const imageUrl = data.preview.src.toString();
        // We don't want to print the original image src because it freezes the browser
        const newData = {
          ...data,
          preview: { ...data.preview, src: `src length: ${imageUrl.length}` },
        };

        return (
          <div key={key}>
            {this.renderSerializedEvent(eventName, newData, key)}
            <div>
              <PreviewImage src={imageUrl} id={data.file.id} />
            </div>
          </div>
        );
      }

      if (eventName === 'upload-finalize-ready') {
        const id = data.file.id;

        return (
          <div key={key}>
            {this.renderSerializedEvent(eventName, data, key)}
            <div>
              <Button onClick={() => data.finalize()}>
                Finalize #{id} (create file on tenant)
              </Button>
            </div>
          </div>
        );
      }

      return this.renderSerializedEvent(eventName, data, key);
    });
  }

  onTeardown = () => {
    this.setState({ hasTorndown: true }, () => {
      this.popup.teardown();
    });
  };

  onCancelUpload = () => {
    const { inflightUploads } = this.state;

    Object.keys(inflightUploads).forEach(uploadId =>
      this.popup.cancel(uploadId),
    );

    this.setState({ inflightUploads: {} });
  };

  renderUploadingFiles = () => {
    const { inflightUploads } = this.state;
    const keys = Object.keys(inflightUploads);
    if (!keys.length) return;

    const uploadingFiles = keys.map(id => {
      const progress = inflightUploads[id].portion;

      return (
        <div key={id}>
          {id} <FileProgress value={progress || 0} max="1" /> : ({progress})
        </div>
      );
    });

    return (
      <UploadingFilesWrapper>
        <h1>Uploading Files</h1>
        {uploadingFiles}
      </UploadingFilesWrapper>
    );
  };

  render() {
    const {
      isAutoFinalizeActive,
      isFetchMetadataActive,
      closedTimes,
      events,
      authEnvironment,
      collectionName,
      inflightUploads,
      hasTorndown,
    } = this.state;
    const isCancelButtonDisabled = Object.keys(inflightUploads).length === 0;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button
            appearance="primary"
            onClick={this.onShow}
            isDisabled={hasTorndown}
          >
            Show
          </Button>
          <Button
            appearance="warning"
            onClick={this.onCancelUpload}
            isDisabled={isCancelButtonDisabled || hasTorndown}
          >
            Cancel uploads
          </Button>
          <Button
            appearance="danger"
            onClick={this.onTeardown}
            isDisabled={hasTorndown}
          >
            Teardown
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
          Closed times: {closedTimes}
        </PopupHeader>
        {this.renderUploadingFiles()}
        <PopupEventsWrapper>{this.renderEvents(events)}</PopupEventsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <PopupWrapper />;
