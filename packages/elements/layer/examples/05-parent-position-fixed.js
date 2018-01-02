// @flow
import React from 'react';
import type { Props } from '../src/components/Layer';
import Layer from '../src';

const fixedDivFirst = {
  position: 'fixed',
  top: '30px',
  left: '200px,',
};

const fixedDivSecond = {
  position: 'fixed',
  top: '400px',
  left: '400px',
};

const alignmentContainer = {
  height: '100px',
  width: '100px',
  backgroundColor: '#eee',
  display: 'inline-block',
};

const PopperContent = (props: Props) => (
  <div style={{ background: '#fca' }}>
    {props.longContent ? (
      <div>
        <p>This is the layer content</p>
        <p>It should be positioned with position: {props.position}</p>
      </div>
    ) : (
      props.position
    )}
    <p>{props.content}</p>
  </div>
);

const ExampleAlignment = (props: Props) => (
  <Layer {...props} content={<PopperContent {...props} />}>
    <div style={alignmentContainer} />
  </Layer>
);

export default () => (
  <div style={{ height: '100%' }}>
    <div style={fixedDivFirst}>
      <ExampleAlignment
        position="bottom center"
        content="When resizing window, flipped popper should not overflow off the top"
        longContent
      />
    </div>
    <div style={fixedDivSecond}>
      <ExampleAlignment
        position="bottom center"
        content="When resizing the window and scrolled down, flipped popper can overflow the viewport."
        longContent
      />
    </div>
  </div>
);
