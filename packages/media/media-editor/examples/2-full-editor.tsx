/* tslint:disable:no-console */

import * as React from 'react';
import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';
import { FullEditor } from '../example-helpers/fullEditor';
import { LoadParameters } from '../src';

const lightGrey = { red: 230, green: 230, blue: 230 };

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  console.log('load', imageUrl, parameters);
};
const onError = (imageUrl: string, error: Error) => {
  console.log('error', imageUrl, error.message, error);
};

export default () => (
  <FullEditor
    imageUrl={imageDataUri}
    backgroundColor={lightGrey}
    onLoad={onLoad}
    onError={onError}
  />
);
