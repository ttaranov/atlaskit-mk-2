// @flow

import React, { Component } from 'react';
import { Field } from '@atlaskit/form';
import TextField from '../src';

const eventResultStyle = {
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em 0',
};

type Props = {};
type State = {| eventResult: string |};

export default class TextFieldExample extends Component<Props, State> {
  state = {
    eventResult:
      'Click into & out of the input above to trigger onBlur & onFocus.',
  };

  handleOnChange = (e: any) => {
    this.setState({
      eventResult: `onChange called with value: ${e.target.value}`,
    });
  };

  handleOnBlur = () => {
    this.setState({ eventResult: 'onBlur called' });
  };

  handleOnFocus = () => {
    this.setState({ eventResult: 'onFocus called' });
  };

  render() {
    const { eventResult } = this.state;

    return (
      <div>
        <Field label="Event handlers">
          <TextField
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
          />
        </Field>
        <div style={eventResultStyle}>{eventResult}</div>

        <Field label="Default value">
          <TextField defaultValue="candy" />
        </Field>

        <Field label="Disabled">
          <TextField isDisabled defaultValue="can't touch this..." />
        </Field>

        <Field label="Required" isRequired>
          <TextField isRequired />
        </Field>

        <Field label="Invalid">
          <TextField isInvalid />
        </Field>

        <Field label="Placeholder">
          <TextField placeholder="Click here to input..." />
        </Field>

        <Field label="Autofocus">
          <TextField autoFocus />
        </Field>

        <Field label="Spell check">
          <TextField spellCheck />
        </Field>
      </div>
    );
  }
}
