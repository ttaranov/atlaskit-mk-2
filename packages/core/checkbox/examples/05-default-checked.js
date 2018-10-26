// @flow
import React, { Component } from 'react';
import Checkbox from '../src/Checkbox';

export default function ControlledExample (props) {
  render() {
    return (
      <div>
        Default Checked Checkbox
        <Checkbox
          defaultChecked
          label="Default Checked Checkbox"
          value="Default Checked Checkbox"
          name="default-checked-checkbox"
        />
      </div>
    );
  }
}
