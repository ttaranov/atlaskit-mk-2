/* tslint:disable:no-console */

import * as React from 'react';
import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';
import { FullEditor } from '../example-helpers/fullEditor';
import { MediaEditor, LoadParameters } from '../src';
import { ShapeParameters } from '../src/common';

const lightGrey = { red: 230, green: 230, blue: 230 };
const transparent = { red: 0, green: 0, blue: 0, alpha: 0 };
const red = { red: 255, green: 0, blue: 0 };

const fixedDimensions = { width: 600, height: 480 };
const shapeParameters = { color: red, lineWidth: 10, addShadow: true };

let loadParameters: LoadParameters;

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  console.log('load', imageUrl, parameters);
  loadParameters = parameters;
};
const onError = (imageUrl: string, error: Error) => {
  console.log('error', imageUrl, error.message, error);
};
const onShapeParametersChanged = (params: ShapeParameters) => {
  console.log('shape parameters changed', params);
};

export default () => (
  <FullEditor
    imageUrl={imageDataUri}
    backgroundColor={lightGrey}
    onLoad={onLoad}
    onError={onError}
  />
);
