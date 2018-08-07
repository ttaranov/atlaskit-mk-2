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
const items: PublicGridItem[] = [
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

class Example extends Component<{}, {}> {
  render() {
    return (
      <div>
        <MediaGrid items={items} context={context} />
      </div>
    );
  }
}

export default () => <Example />;
