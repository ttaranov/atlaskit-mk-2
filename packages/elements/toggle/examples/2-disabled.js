// @flow
import React from 'react';
// TODO: @atlaskit/toggle
import Toggle from '../src';

export default () => (
  <div>
    <p>Regular</p>
    <Toggle isDisabled />
    <p>Large (checked by default)</p>
    <Toggle size="large" isDisabled isDefaultChecked />
  </div>
);
