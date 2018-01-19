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
  enableMock,
  disableMock,
} from '@atlaskit/media-test-helpers';
import { MediaPicker, Popup } from '../src';
import {
  PopupContainer,
  PopupHeader,
  PopupEventsWrapper,
  PreviewImage,
} from '../example-helpers/styled';
import { AuthEnvironment } from '../example-helpers';

export interface PopupWrapperState {
  isAutoFinalizeActive: boolean;
  isFetchMetadataActive: boolean;
  collectionName: string;
  closedTimes: number;
  events: any[];
  authEnvironment: AuthEnvironment;
  inflightUploads: string[];
  hasTorndown: boolean;
  mocked: boolean;
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
    inflightUploads: [],
    hasTorndown: false,
    mocked: false,
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
      const newInflightUploads = data.files.map(file => file.id);

      this.setState({
        inflightUploads: [...this.state.inflightUploads, ...newInflightUploads],
      });
    }

    if (eventName === 'upload-processing') {
      const processingFileId = data.file.id;
      const inflightUploads = this.state.inflightUploads.filter(
        fileId => fileId !== processingFileId,
      );

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

    inflightUploads.forEach(uploadId => this.popup.cancel(uploadId));

    this.setState({ inflightUploads: [] });
  };

  toggleMock = () => {
    this.state.mocked ? disableMock() : enableMock();
    this.state.mocked = !this.state.mocked;
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
      mocked,
    } = this.state;
    const isCancelButtonDisabled = inflightUploads.length === 0;

    return (
      <PopupContainer>
        <PopupHeader>
          <Button
            onClick={this.toggleMock}
            appearance={this.state.mocked ? 'danger' : 'primary'}
          >
            {this.state.mocked ? 'Mocked!' : 'Mock XHR'}
          </Button>
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
        <PopupEventsWrapper>{this.renderEvents(events)}</PopupEventsWrapper>
      </PopupContainer>
    );
  }
}

export default () => <PopupWrapper />;
