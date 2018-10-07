import {
  defaultMediaPickerAuthProvider,
  tallImage,
} from '@atlaskit/media-test-helpers';
import { Component, ChangeEvent } from 'react';
import * as React from 'react';
import {
  ImagePreview,
  MetadataWrapper,
  PreviewWrapper,
  Wrapper,
  FileInput,
} from '../example-helpers/styled';
import { uploadFile, MediaStore } from '../src';

type UploaderExampleProps = {};
export interface UploaderExampleState {
  uploadingProgress: number;
  processingStatus?: string;
  fileURL?: string;
  fileMetadata?: any;
  error?: any;
}

const store = new MediaStore({
  authProvider: defaultMediaPickerAuthProvider,
});

class UploaderExample extends Component<
  UploaderExampleProps,
  UploaderExampleState
> {
  state: UploaderExampleState = {
    uploadingProgress: 0,
  };

  fetchFile = (id: string) => {
    store.getFile(id).then(async response => {
      const fileMetadata = response.data;
      const { processingStatus } = fileMetadata;

      this.setState({ processingStatus });

      if (processingStatus === 'pending') {
        setTimeout(() => this.fetchFile(id), 1000);
      } else {
        const fileURL = await store.getFileImageURL(id);

        this.setState({
          fileMetadata,
          fileURL,
        });
      }
    });
  };

  render() {
    const { fileURL, uploadingProgress, processingStatus } = this.state;

    return (
      <Wrapper>
        <PreviewWrapper>
          <div>
            File <FileInput type="file" onChange={this.onChange} />
          </div>
          <div>
            String
            <button onClick={this.onUploadStringClick}>Upload</button>
          </div>
          <div>
            <progress value={uploadingProgress} max="1" />
          </div>
          <div>Processing status: {processingStatus}</div>
          <div>
            {fileURL ? <ImagePreview src={fileURL} alt="preview" /> : null}
          </div>
        </PreviewWrapper>
        {this.renderMetadata()}
      </Wrapper>
    );
  }

  renderMetadata() {
    const { fileMetadata } = this.state;
    if (!fileMetadata) {
      return;
    }

    return (
      <MetadataWrapper>{JSON.stringify(fileMetadata, null, 2)}</MetadataWrapper>
    );
  }

  onProgress = (uploadingProgress: number) => {
    this.setState({
      uploadingProgress,
    });
  };

  onUploadStringClick = () => {
    uploadFile(
      { content: tallImage },
      new MediaStore({ authProvider: defaultMediaPickerAuthProvider }),
      {
        onProgress: this.onProgress,
      },
    )
      .deferredFileId.then(this.fetchFile)
      .catch(this.onError);
  };

  onError = (error: any) => {
    this.setState({ error });
  };

  private readonly onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;
    if (!files) {
      return;
    }
    const file = files[0];

    uploadFile(
      { content: file, name: file.name, mimeType: file.type },
      new MediaStore({ authProvider: defaultMediaPickerAuthProvider }),
      {
        onProgress: this.onProgress,
      },
    )
      .deferredFileId.then(this.fetchFile)
      .catch(this.onError);
  };
}

export default () => <UploaderExample />;
