import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import {
  videoProcessingFailedId,
  imageFileId,
  defaultServiceHost,
  defaultCollectionName,
  mediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';
import { ContextFactory } from '../src';
import { FilesWrapper, FileWrapper } from '../example-helpers/styled';
import { Observable } from 'rxjs/Observable';
import { FileState } from '../src/fileState';

export interface ComponentProps {}
export interface ComponentState {
  files: { [id: string]: FileState };
}

const mediaContext = ContextFactory.create({
  serviceHost: defaultServiceHost,
  authProvider: mediaPickerAuthProvider('asap'),
});

class Example extends Component<ComponentProps, ComponentState> {
  fileStreams: Observable<FileState>[];

  constructor(props: ComponentProps) {
    super(props);

    this.state = {
      files: {},
    };
    this.fileStreams = [];
  }

  componentDidMount() {
    this.getImageFile();
  }

  getImageFile = () => {
    this.getFile(imageFileId.id, imageFileId.collectionName);
  };

  getProcessingFailedFile = () => {
    this.getFile(
      videoProcessingFailedId.id,
      videoProcessingFailedId.collectionName,
    );
  };

  onFileUpdate = (state: FileState) => {
    console.log('on update', state);
    this.setState({
      files: {
        ...this.state.files,
        [state.id]: state,
      },
    });
  };

  getFile = (id: string, collectionName?: string) => {
    const stream = mediaContext.getFile(id, { collectionName });

    this.addStream(stream);
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];
    const { deferredFileId } = mediaContext.uploadFile({
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    });
    const fileId = await deferredFileId;
    this.getFile(fileId);
  };

  addStream = (stream: Observable<FileState>) => {
    stream.subscribe({
      next: this.onFileUpdate,
      complete() {
        console.log('complete');
      },
      error(error) {
        console.log('error', error);
      },
    });

    this.fileStreams.push(stream);
  };

  renderFiles = () => {
    const { files } = this.state;
    const fileData = Object.keys(files).map((fileId, key) => {
      const file = files[fileId];
      let name, progress;

      if (file.status !== 'error') {
        name = <div>name: {file['name']}</div>;
      }

      if (file.status === 'uploading') {
        progress = <div>progress: {file.progress}</div>;
      }

      return (
        <FileWrapper key={key}>
          <div>Id: {file.id}</div>
          <div>Status: {file.status}</div>
          <div>
            {name}
            {progress}
          </div>
        </FileWrapper>
      );
    });

    return <FilesWrapper>{fileData}</FilesWrapper>;
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.getImageFile}>Get image file</button>
        <div>
          <h1>Files</h1>
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}

export default () => (
  <div>
    <Example />
    {/* <Example /> */}
  </div>
);
