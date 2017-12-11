// @flow
import React, { PureComponent } from 'react';
import Checkbox, { CheckboxStateless, CheckboxGroup } from '../src';

export default class CheckboxGroupExample extends PureComponent<void> {
  render() {
    return (
      <CheckboxGroup>
        <Checkbox
          value="Checkbox One"
          label="Checkbox One"
          name="checkbox-one"
        />
        <Checkbox
          label="Checkbox Two"
          value="Checkbox Two"
          name="checkbox-two"
        />
        <Checkbox
          label="Checkbox Three"
          value="Checkbox Three"
          name="checkbox-three"
        />
      </CheckboxGroup>
    );
  }
}
