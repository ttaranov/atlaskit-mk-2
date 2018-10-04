// @flow

import React, { Component } from 'react';
import TextField from '../src';

type State = {
  isControlled: boolean,
  value: string,
};

export default class BasicExample extends Component<void, State> {
  state = {
    isControlled: false,
    value: 'Controlled value',
  };

  onChangeCheckbox = () => {
    this.setState(state => ({
      isControlled: !state.isControlled,
    }));
  };

  onChangeTextField = (e: any) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { isControlled, value } = this.state;
    return (
      <div>
        <p>
          <label htmlFor="checkbox">
            <input
              checked={isControlled}
              id="checkbox"
              onChange={this.onChangeCheckbox}
              type="checkbox"
            />{' '}
            is controlled.
          </label>
        </p>
        <TextField
          label="Controlled value for input below"
          onChange={this.onChangeTextField}
          value={value}
        />
        <TextField
          label="Controlled / uncontrolled component"
          defaultValue="Default value"
          value={isControlled ? value : undefined}
        />
      </div>
    );
  }
}
