import {
  defaultServiceHost,
  defaultMediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import { Component, ChangeEvent } from 'react';
import * as React from 'react';

import { uploadFile, MediaStore } from '../src/';

type UploaderExampleProps = {};
export interface UploaderExampleState {
  fileURL?: string;
}

const store = new MediaStore({
  apiUrl: defaultServiceHost,
  authProvider: defaultMediaPickerAuthProvider,
});

class UploaderExample extends Component<
  UploaderExampleProps,
  UploaderExampleState
> {
  state: UploaderExampleState = {};

  fetchFile = (id: string) => {
    store.fetchFile(id).then(async response => {
      const { processingStatus } = response.data;
      console.log('processingStatus', id, processingStatus);

      if (processingStatus === 'pending') {
        setTimeout(() => this.fetchFile(id), 1000);
      } else {
        const fileURL = await store.getFileImageURL(id);
        console.log('fileURL', fileURL);
        this.setState({
          fileURL,
        });
      }
    });
  };

  render() {
    const { fileURL } = this.state;

    return (
      <div>
        <div>
          Upload a file <input type="file" onChange={this.onChange} />
        </div>
        <div>
          or
          <button id="string-upload">Upload a string</button>
        </div>
        <div>
          <img src={fileURL} alt="preview" />
        </div>
      </div>
    );
  }

  private readonly onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { files } } = e;

    uploadFile(
      { content: files[0] },
      {
        apiUrl: defaultServiceHost,
        authProvider: defaultMediaPickerAuthProvider,
      },
    )
      .then(id => {
        console.log('file uploaded', id);
        this.fetchFile(id);
      })
      .catch(err => {
        console.log('upload error', err);
      });
  };
}

export default () => <UploaderExample />;
