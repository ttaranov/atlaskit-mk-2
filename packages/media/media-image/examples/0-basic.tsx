import * as React from 'react';
import { Component } from 'react';
import FieldText from '@atlaskit/field-text';
import {
  genericFileId,
  gifFileId,
  largeImageFileId,
  imageFileId,
  docFileId,
  errorFileId,
  defaultCollectionName,
  createStorybookContext,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import Select from '@atlaskit/select';
import { MediaImage } from '../src';
import { OptionsWrapper, MediaImageWrapper } from '../example-helpers/styled';

export interface ExampleProps {}

export interface ExampleState {
  imageId: {
    label: string;
    value: string;
  };
  width: number;
  height: number;
}

const context = createStorybookContext();
const imageIds = [
  { label: 'Generic', value: genericFileId.id },
  { label: 'Gif', value: gifFileId.id },
  { label: 'Large', value: largeImageFileId.id },
  { label: 'Image', value: imageFileId.id },
  { label: 'Doc', value: docFileId.id },
  { label: 'Error', value: errorFileId.id },
];
class Example extends Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    imageId: imageIds[0],
    width: 100,
    height: 100,
  };

  onWidthChange = e => {
    this.setState({
      width: parseInt(e.target.value),
    });
  };

  onHeightChange = e => {
    this.setState({
      height: parseInt(e.target.value),
    });
  };

  onIdChange = imageId => {
    this.setState({
      imageId,
    });
  };

  render() {
    const { imageId, width, height } = this.state;

    return (
      <div>
        <OptionsWrapper>
          <Select
            options={imageIds}
            value={imageId}
            onChange={this.onIdChange}
          />
          <FieldText
            label="width"
            placeholder="width"
            value={`${width}`}
            onChange={this.onWidthChange}
          />
          <FieldText
            label="height"
            placeholder="height"
            value={`${height}`}
            onChange={this.onHeightChange}
          />
        </OptionsWrapper>
        <MediaImageWrapper>
          <MediaImage
            id={imageId.value}
            context={context}
            collectionName={defaultCollectionName}
            width={width}
            height={height}
            loadingPlaceholder={<Spinner />}
            errorPlaceholder={<div>Error :(</div>}
          />
        </MediaImageWrapper>
      </div>
    );
  }
}

export default () => <Example />;
