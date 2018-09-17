import * as React from 'react';
import { Component } from 'react';
import FieldText from '@atlaskit/field-text';
import {
  genericFileId,
  defaultCollectionName,
  createStorybookContext,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';

import { MediaImage } from '../src';

export interface ExampleProps {}

export interface ExampleState {
  imageId: string;
}

const context = createStorybookContext();

class Example extends Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    imageId: genericFileId.id,
  };

  onIdChange = e => {
    this.setState({
      imageId: e.target.value,
    });
  };

  render() {
    const { imageId } = this.state;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            borderBottom: '1px solid #ccc',
            padding: '10px',
            margin: '10px auto',
            width: '1000px',
          }}
        >
          <FieldText
            label="Image id"
            placeholder="Image id..."
            value={imageId}
            onChange={this.onIdChange}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MediaImage
            id={imageId}
            context={context}
            collectionName={defaultCollectionName}
            width={300}
            placeholder={<Spinner />}
          />
        </div>
      </div>
    );
  }
}

export default () => <Example />;
