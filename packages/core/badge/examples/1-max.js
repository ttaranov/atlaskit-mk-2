// @flow

import React from 'react';
import Badge from '../src';

export default function Example() {
  return (
    <div>
      <p>with no value</p>
      <Badge />

      <p>with a negative value</p>
      <Badge value={-5} />

      <p>with a value greater than max value</p>
      <Badge value={500} max={99} />

      <p>with a value less than max value</p>
      <Badge value={50} max={99} />

      <p>with a value equal to max value</p>
      <Badge value={99} max={99} />
    </div>
  );
}
