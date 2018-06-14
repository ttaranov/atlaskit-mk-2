// @flow
import React, { PureComponent } from 'react';
import FieldTextArea from '../src/FieldTextArea';

export default class ResizableExample extends PureComponent<void, void> {
  render() {
    return (
      <div>
        <FieldTextArea label="enableResize={true}" enableResize />
        <FieldTextArea
          label="enableResize={'vertical'}"
          enableResize={'vertical'}
        />
        <FieldTextArea
          label="enableResize={'horizontal'}"
          enableResize={'horizontal'}
        />
      </div>
    );
  }
}
