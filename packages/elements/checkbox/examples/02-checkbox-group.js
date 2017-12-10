// @flow
import React, { PureComponent } from 'react';
import Checkbox, { CheckboxStateless, CheckboxGroup } from '../src';

export default class CheckboxGroupExample extends PureComponent {
  render() {
    return (
      <CheckboxGroup>
        <Checkbox value="Checkbox One" label="Checkbox One" />
        <Checkbox label="Checkbox Two" value="Checkbox Two" />
        <Checkbox label="Checkbox Three" value="Checkbox Three" />
      </CheckboxGroup>
    );
  }
}
