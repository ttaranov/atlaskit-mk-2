// @flow
import React from 'react';
import Toggle from '@atlaskit/toggle';

export default () => (
  <div>
    <p>Regular</p>
    <Toggle isDisabled />
    <p>Large (checked by default)</p>
    <Toggle size="large" isDisabled isDefaultChecked />
  </div>
);
