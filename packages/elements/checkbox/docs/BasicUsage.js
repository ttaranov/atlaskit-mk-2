import React, { PureComponent } from 'react';
import Checkbox, { CheckboxGroup } from '@atlaskit/checkbox';

const CheckboxExamples = class extends PureComponent {
  state = { isDropdownOpen: false };

  render() {
    return (
      <CheckboxGroup>
        <Checkbox value="example" label="Example One" />
        <Checkbox initiallyChecked label="Beginning Checked" value="example2" />
        <Checkbox isDisabled label="Disabled" value="example3" />
        <Checkbox
          initiallyChecked
          isDisabled
          label="Disabled and checked"
          value="example4"
        />
        <Checkbox isInvalid label="Invalid checkbox" value="example5" />
      </CheckboxGroup>
    );
  }
};

export default CheckboxExamples;
