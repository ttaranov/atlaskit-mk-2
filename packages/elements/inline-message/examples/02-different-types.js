// @flow
import React from 'react';
import InlineMessage from '../src';

export default () => (
  <div>
    <InlineMessage title="Default Type">
      <p>Default type dialog</p>
    </InlineMessage>
    <InlineMessage title="Confirmation Inline Message" type="confirmation">
      <p>Confirmation type dialoge</p>
    </InlineMessage>
    <InlineMessage title="Info Inline Message" type="info">
      <p>Info type dialog</p>
    </InlineMessage>
    <InlineMessage title="Warning Inline Message" type="warning">
      <p>Warning type dialog</p>
    </InlineMessage>
    <InlineMessage title="Error Inline Message" type="error">
      <p>Error type dialog</p>
    </InlineMessage>
  </div>
);
