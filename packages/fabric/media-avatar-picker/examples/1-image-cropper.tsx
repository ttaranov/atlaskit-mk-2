/* tslint:disable:variable-name */
import * as React from 'react';
import {ImageCropper} from '../src';
import {tallImage} from '@atlaskit/media-test-helpers';

const naturalWidth = 5360;

export default () => (
  <div>
    <div>
      <h1>default</h1>
      <ImageCropper imageSource={tallImage} imageWidth={naturalWidth} scale={0.08} top={-80} left={-80} onDragStarted={() => console.log('DragStarted')} />
    </div>
    <div>
      <h1>when image width is not set</h1>
      <ImageCropper imageSource={tallImage} scale={0.14} top={-50} left={-115} />
    </div>
    <div>
      <h1>with custom container size</h1>
      <ImageCropper imageSource={tallImage} imageWidth={naturalWidth} scale={0.14} top={-50} left={-115} containerSize={400} />
    </div>
    <div>
      <h1>with circular mask</h1>
      <ImageCropper imageSource={tallImage} imageWidth={naturalWidth} scale={0.08} top={-70} left={-90} isCircularMask={true} />
    </div>
  </div>
)
