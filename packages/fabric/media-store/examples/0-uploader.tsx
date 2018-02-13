import {
  defaultServiceHost,
  defaultMediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import { Component, ChangeEvent } from 'react';
import * as React from 'react';

import { uploadFile } from '../src/';

type UploaderExampleProps = {};

class UploaderExample extends Component<UploaderExampleProps> {
  render() {
    return (
      <div>
        <div>
          Upload a file <input type="file" onChange={this.onChange} />
        </div>
        <div>
          or
          <button id="string-upload">Upload a string</button>
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
    );
    //   .then(value => console.log('uploadFile:', value))
    //   .catch(console.error);
  };
}

export default () => <UploaderExample />;
