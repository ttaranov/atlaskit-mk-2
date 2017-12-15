// @flow
import React, { PureComponent } from 'react';
import FieldBase, { Label } from '@atlaskit/field-base';
import Input from '@atlaskit/input';

export default class LabelExample extends PureComponent<void, void> {
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
