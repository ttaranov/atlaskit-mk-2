// @flow
import React from 'react';
import Layer from '../src';

const layerStyles = {
  background: 'green',
  padding: '5px',
};

const targetStyle = {
  display: 'inline-block',
  position: 'absolute',
  top: '100px',
  left: '150px',
  background: 'red',
  padding: '50px',
};

const content = <div style={layerStyles}>LayerContent</div>;

export default () => (
  <div>
    <Layer content={content} position="right bottom">
      <div style={targetStyle}>Target</div>
    </Layer>
    <div>
      Drag the left side bar over until the LayerContent reaches the edge of the
      screen
    </div>
  </div>
);
