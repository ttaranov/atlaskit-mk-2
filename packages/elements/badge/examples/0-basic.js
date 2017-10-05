// @flow
import React from 'react';
import Badge from '../src';

export default function Example() {
  return (
    <div>
      <p>Default</p>
      <Badge value={5} />

      <p>Primary</p>
      <Badge appearance="primary" value={-5} />

      <p>Primary Inverted</p>
      <Badge appearance="primaryInverted" value={-5} />

      <p>Important</p>
      <Badge appearance="important" value={25} />

      <p>Added (no theme change)</p>
      <Badge appearance="added" max={99} value={3000} />

      <p>Removed (no theme change)</p>
      <Badge appearance="removed" />
    </div>
  );
}
