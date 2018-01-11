/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  defaultMediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
  userAuthProviderBaseURL,
} from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { MediaPicker, BinaryUploader } from '../src';

export interface BinaryWrapperState {
  finalizeCallback: any;
}

class BinaryWrapper extends Component<{}, BinaryWrapperState> {
  binary: BinaryUploader;
  dropzoneContainer: HTMLDivElement;

  state: BinaryWrapperState = {
    finalizeCallback: null,
  };

  componentDidMount() {
    this.createBinary();
  }

  createBinary() {
    const config = {
      authProvider: defaultMediaPickerAuthProvider,
      apiUrl: userAuthProviderBaseURL,
      uploadParams: {
        autoFinalize: false,
        collection: defaultMediaPickerCollectionName,
      },
    };
    const binary = MediaPicker('binary', config);

    this.binary = binary;

    binary.upload(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
      'screen-capture.gif',
    );
    binary.on('upload-finalize-ready', data => {
      console.log('upload finalize ready:', data);

      this.setState({ finalizeCallback: data.finalize });
    });
    binary.on('upload-end', mpFile => console.log(mpFile));
    binary.on('upload-error', mpError => console.log(mpError));
  }

  onFinalize = () => {
    const { finalizeCallback } = this.state;

    finalizeCallback();
  };

  render() {
    const { finalizeCallback } = this.state;

    return (
      <Button
        appearance="primary"
        onClick={this.onFinalize}
        isDisabled={!finalizeCallback}
      >
        Finalize
      </Button>
    );
  }
}

export default () => <BinaryWrapper />;
