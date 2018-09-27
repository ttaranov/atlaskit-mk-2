/* tslint:disable:no-console */

import * as React from 'react';
import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';
import { FullEditor } from '../example-helpers/fullEditor';
import { LoadParameters } from '../src';

const lightGrey = { red: 230, green: 230, blue: 230 };

let loadParameters: LoadParameters;

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  console.log('load', imageUrl, parameters);
  loadParameters = parameters;
};
const onError = (imageUrl: string, error: Error) => {
  console.log('error', imageUrl, error.message, error);
};

export default () => (
  <div>
    <FullEditor
      imageUrl={imageDataUri}
      backgroundColor={lightGrey}
      onLoad={onLoad}
      onError={onError}
    />

    <button
      style={{
        position: 'absolute',
        width: '100px',
        height: '30px',
        right: '0',
        top: '0',
      }}
      onClick={() => {
        const image = loadParameters.imageGetter();
        if (image.isExported && image.content) {
          console.log('image received', image);
          window.open(image.content);
        } else {
          console.log('image not received', image);
        }
      }}
    >
      Export image
    </button>
  </div>
);
