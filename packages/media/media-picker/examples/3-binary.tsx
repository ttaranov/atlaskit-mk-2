/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  defaultMediaPickerAuthProvider,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaPicker, BinaryUploader, BinaryConfig } from '../src';
import { ContextFactory } from '@atlaskit/media-core';

class BinaryWrapper extends Component<{}> {
  binary?: BinaryUploader;
  dropzoneContainer?: HTMLDivElement;

  componentDidMount() {
    this.createBinary();
  }

  createBinary() {
    const context = ContextFactory.create({
      authProvider: defaultMediaPickerAuthProvider,
    });
    const config: BinaryConfig = {
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
    };
    const binary = MediaPicker('binary', context, config);

    this.binary = binary;

    binary.upload(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
      'screen-capture.gif',
    );
    binary.on('upload-end', mpFile => console.log(mpFile));
    binary.on('upload-error', mpError => console.log(mpError));
  }

  render() {
    return <div>See the console</div>;
  }
}

export default () => <BinaryWrapper />;
