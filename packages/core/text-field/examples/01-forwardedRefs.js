// @flow

import React, { Component, type ElementRef } from 'react';
import Button from '@atlaskit/button';
import TextField from '../src';

type Props = {};

class TextFieldExample extends Component<Props> {
  input: ElementRef<*>;
  constructor(props: Props) {
    super(props);
    this.input = React.createRef();
  }

  handleFocus = () => {
    this.input.focus();
  };

  render() {
    return (
      <div>
        <TextField ref={ref => (this.input = ref)} />
        <div style={{ padding: 4 }}>
          <Button appearance="primary" onClick={this.handleFocus}>
            Focus TextField
          </Button>
        </div>
      </div>
    );
  }
}

export default TextFieldExample;
