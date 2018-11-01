// @flow

import React, { Component, type ElementRef } from 'react';
import Button from '@atlaskit/button';
import TextField from '../src';

type Props = {};
type FormRef = {
  focus: () => any,
};

class TextFieldExample extends Component<Props> {
  input: FormRef;

  handleRef = (ref: ElementRef<*>) => {
    this.input = ref;
  };

  handleFocus = () => {
    this.input.focus();
  };

  render() {
    return (
      <div>
        <TextField ref={this.handleRef} />
        <p>
          <Button appearance="primary" onClick={this.handleFocus}>
            Focus TextField
          </Button>
        </p>
      </div>
    );
  }
}

export default TextFieldExample;
