/* tslint:disable:variable-name */
import * as React from 'react';
import {tallImage, smallImage, remoteImage} from '@atlaskit/media-test-helpers';
import {ImageNavigator} from '../src';

let onLoadParams;
let imageElement;

const onLoad = (params) => {
  onLoadParams = params;
};
const exportImage = () => {
  const imageData = onLoadParams.export();

  imageElement.src = imageData;
};

function handleImgRef(img) {
  imageElement = img;
}

export default () => (
  <div>
    <h1>Local tall image</h1>
    <ImageNavigator
      imageSource={tallImage}
      onImageChanged={() => console.log('onImageChanged')}
      onPositionChanged={() => console.log('onPositionChanged')}
      onSizeChanged={() => console.log('onSizeChanged')}
      onLoad={onLoad}
    />
    <button onClick={exportImage}>Export</button>
    <img style={{position: 'absolute', top: 0, left: '300px'}} src="" alt="" ref={handleImgRef} />
  </div>
)