/* tslint:disable:no-console */

import * as React from 'react';
import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';
import { MediaEditor, LoadParameters } from '../src';
import { ShapeParameters } from '../src/common';

const transparent = { red: 0, green: 0, blue: 0, alpha: 0 };
const red = { red: 255, green: 0, blue: 0 };

const fixedDimensions = { width: 600, height: 480 };
const shapeParameters = { color: red, lineWidth: 10, addShadow: true };

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  console.log('load', imageUrl, parameters);
};
const onError = (imageUrl: string, error: Error) => {
  console.log('error', imageUrl, error.message, error);
};
const onShapeParametersChanged = (params: ShapeParameters) => {
  console.log('shape parameters changed', params);
};

export default () => (
  <MediaEditor
    imageUrl={imageDataUri}
    dimensions={fixedDimensions}
    backgroundColor={transparent}
    shapeParameters={shapeParameters}
    tool={'arrow'}
    onLoad={onLoad}
    onError={onError}
    onShapeParametersChanged={onShapeParametersChanged}
  />
);
