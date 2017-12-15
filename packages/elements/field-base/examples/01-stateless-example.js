// @flow
import React, { PureComponent } from 'react';
import { FieldBaseStateless } from '@atlaskit/field-base';
import Input from '@atlaskit/input';

export default class StatelessExample extends PureComponent<void, void> {
  render() {
    return (
      <FieldBaseStateless
        appearance="standard"
        onBlur={() => {}}
        onFocus={() => {}}
        isFitContainerWidthEnabled
        isRequired
      >
        <Input isEditing />
      </FieldBaseStateless>
    );
  }
}
