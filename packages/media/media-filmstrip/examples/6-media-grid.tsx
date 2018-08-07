import * as React from 'react';
import { Component } from 'react';
import { MediaGrid, PublicGridItem } from '../src';
import {
  createStorybookContext,
  imageFileId,
  largeImageFileId,
  smallImageFileId,
  wideImageFileId,
} from '@atlaskit/media-test-helpers';

const image = {
  id: imageFileId.id,
  dimensions: {
    width: 1138,
    height: 759,
  },
};
const largeImage = {
  id: largeImageFileId.id,
  dimensions: {
    width: 273,
    height: 775,
  },
};
const smallImage = {
  id: smallImageFileId.id,
  dimensions: {
    width: 20,
    height: 20,
  },
};
const wideImage = {
  id: wideImageFileId.id,
  dimensions: {
    width: 582,
    height: 54,
  },
};
const defaultItems: PublicGridItem[] = [
  image,
  largeImage,
  image,
  smallImage,
  wideImage,
  largeImage,
  wideImage,
  largeImage,
];
const context = createStorybookContext();

interface ExampleState {
  items: PublicGridItem[];
}

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    items: defaultItems,
  };

  addFile = () => {
    const { items } = this.state;
    const index = Math.floor(Math.random() * items.length);
    const newItem = items[index];

    this.setState({
      items: [newItem, ...items],
    });
  };

  render() {
    const { items } = this.state;

    return (
      <div>
        <button onClick={this.addFile}>Add file</button>
        <MediaGrid items={items} context={context} />
      </div>
    );
  }
}

export default () => <Example />;
