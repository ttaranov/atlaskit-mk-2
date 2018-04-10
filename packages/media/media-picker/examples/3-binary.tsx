/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  defaultMediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
  userAuthProviderBaseURL,
} from '@atlaskit/media-test-helpers';
import { MediaPicker, BinaryUploader } from '../src';

class BinaryWrapper extends Component<{}, {}> {
  binary: BinaryUploader;
  dropzoneContainer: HTMLDivElement;

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
    binary.on('upload-end', mpFile => console.log(mpFile));
    binary.on('upload-error', mpError => console.log(mpError));
  }

  render() {
    return <div>See console</div>;
  }
}

export default () => <BinaryWrapper />;
