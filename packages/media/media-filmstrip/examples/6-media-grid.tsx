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
    width: 300,
    height: 100,
  },
};
const largeImage = {
  id: largeImageFileId.id,
  dimensions: {
    width: 300,
    height: 100,
  },
};
const smallImage = {
  id: smallImageFileId.id,
  dimensions: {
    width: 300,
    height: 100,
  },
};
const wideImage = {
  id: wideImageFileId.id,
  dimensions: {
    width: 300,
    height: 100,
  },
};
const items: PublicGridItem[] = [image, largeImage, smallImage, wideImage];
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
