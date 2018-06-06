// @flow
import React from 'react';
import Tag from '../src';

export default () => (
  <div>
    <Tag
      text="Custom tag"
      color={{ backgroundColor: 'green', textColor: 'blue' }}
    />
  </div>
);
