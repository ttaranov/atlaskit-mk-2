// @flow
import React, { PureComponent } from 'react';
import Input from '@atlaskit/input';
import { FieldBaseStateless } from '../src';

export default function StatelessExample (props) {
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
