/* tslint:disable variable-name */
import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import { Identifier, FileIdentifier } from '@atlaskit/media-card';
import {
  createUploadContext,
  genericFileId,
  audioFileId,
  errorFileId,
  gifFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { Filmstrip } from '../src';
import { ExampleWrapper, FilmstripWrapper } from '../example-helpers/styled';

export interface ExampleState {
  identifiers: Identifier[];
}

const context = createUploadContext();
const initialIdentifiers: Identifier[] = [
  genericFileId,
  audioFileId,
  errorFileId,
  gifFileId,
];

class Example extends Component<any, ExampleState> {
  state: ExampleState = {
    identifiers: initialIdentifiers,
  };

  uploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || !event.currentTarget.files.length) {
      return;
    }

    const file = event.currentTarget.files[0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: defaultCollectionName,
    };
    const stream = context.uploadFile(uplodableFile);

    stream.first().subscribe({
      next: state => {
        if (state.status === 'uploading') {
          const { id } = state;
          const { identifiers } = this.state;
          const newIdentifier: FileIdentifier = {
            id,
            mediaItemType: 'file',
            collectionName: defaultCollectionName,
          };

          this.setState({
            identifiers: [newIdentifier, ...identifiers],
          });
        }
      },
      error(error) {
        console.log('stream error', error);
      },
    });
  };

  render() {
    const { identifiers } = this.state;

    return (
      <ExampleWrapper>
        <FilmstripWrapper>
          <Filmstrip context={context} identifiers={identifiers} />
        </FilmstripWrapper>
        Upload file <input type="file" onChange={this.uploadFile} />
      </ExampleWrapper>
    );
  }
}

export default () => <Example />;
