// @flow
import React, { PureComponent } from 'react';
import Input from '@atlaskit/input';
import FieldBase, { Label } from '../src';

export default function LabelExample (props) {
  render() {
    return (
      <div>
        <Label
          label="Default label for the input below"
          isFirstChild
          htmlFor="input-id-example"
          isRequired
        >
          <FieldBase>
            <Input isEditing id="input-id-example" />
          </FieldBase>
        </Label>
        <Label label="Inline edit label" appearance="inline-edit" />
      </div>
    );
  }
}
