import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookContext,
  imageFileId,
} from '@atlaskit/media-test-helpers';
import { Context, FileState } from '../src';
import { FilesWrapper, FileWrapper } from '../example-helpers/styled';
import { Observable } from 'rxjs/Observable';

export interface ComponentProps {}
export interface ComponentState {
  files: { [id: string]: FileState };
}

class Example extends Component<ComponentProps, ComponentState> {
  mediaContext: Context;
  fileStreams: Observable<FileState>[];

  constructor(props: ComponentProps) {
    super(props);

    this.mediaContext = createStorybookContext();
    this.state = {
      files: {},
    };
    this.fileStreams = [];
  }

  componentDidMount() {
    this.getFile(imageFileId.id, imageFileId.collectionName);
  }

  onFileUpdate = (state: FileState) => {
    console.log('onFileUpdate', state);
    this.setState({
      files: {
        ...this.state.files,
        [state.id]: state,
      },
    });
  };

  getFile = (id: string, collectionName: string) => {
    const stream = this.mediaContext.getFile(id, { collectionName });

    this.addStream(stream);
  };

  uploadFile = () => {
    const stream = this.mediaContext.uploadFile();

    this.addStream(stream);
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

      if (file.status === 'processed') {
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
        <button onClick={this.uploadFile}>Upload fake file 🚀</button>
        <div>
          <h1>Files</h1>
          {this.renderFiles()}
        </div>
      </div>
    );
  }
}

export default () => <Example />;
