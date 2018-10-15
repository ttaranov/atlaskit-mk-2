import * as React from 'react';
import { Component, ReactNode } from 'react';
import {
  createStorybookContext,
  imageFileId,
  genericFileId,
  gifFileId,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import * as uuid from 'uuid';
import { FileState } from '../src';
import { FileStateWrapper } from '../example-helpers/styled';

export interface ExampleState {
  fileStates: { [id: string]: FileState };
}

const context = createStorybookContext();

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    fileStates: {},
  };

  componentDidMount() {
    this.fetchItem(imageFileId.id, imageFileId.collectionName); // Normal case
    this.fetchItem(genericFileId.id, genericFileId.collectionName); // Normal case
    this.fetchItem(imageFileId.id, imageFileId.collectionName); // Calling the first item again
    this.fetchItem(imageFileId.id); // Calling first item without collection on pourpuse
    this.fetchItem(uuid(), defaultCollectionName); // No existing item
  }

  fetchItem(id: string, collectionName?: string) {
    context.file.getFileState(id, { collectionName }).subscribe({
      next: state => {
        const { fileStates } = this.state;

        fileStates[state.id] = state;
        this.setState({
          fileStates,
        });
      },
    });
  }

  fetchFirstItem = () => {
    this.fetchItem(imageFileId.id, imageFileId.collectionName);
  };

  fetchNewItem = () => {
    this.fetchItem(gifFileId.id, gifFileId.collectionName);
  };

  renderFileState = (): ReactNode => {
    const { fileStates } = this.state;
    const states = Object.keys(fileStates).map(id => {
      let name: string = '';
      const state = fileStates[id];
      if (state.status !== 'error') {
        name = state.name;
      }

      return (
        <FileStateWrapper key={id}>
          <h3>Id: {id}</h3>
          <div>Name: {name}</div>
        </FileStateWrapper>
      );
    });

    return <div>{states}</div>;
  };

  render() {
    return (
      <div>
        <button onClick={this.fetchFirstItem}>Fetch first item</button>
        <button onClick={this.fetchNewItem}>Fetch new item</button>
        {this.renderFileState()}
      </div>
    );
  }
}

export default () => <Example />;
