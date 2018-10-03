// @flow

import React, { Component, Fragment } from 'react';
import TextField from '../src';

type State = {
  isControlled: boolean,
};

export default class BasicExample extends Component<void, State> {
  state = {
    isControlled: false,
  };

  onChangeCheckbox = () => {
    this.setState(state => ({
      isControlled: !state.isControlled,
    }));
  };

  render() {
    const { isControlled } = this.state;
    return (
      <Fragment>
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
          label="Controlled / uncontrolled"
          defaultValue="Default value"
          value={isControlled ? 'Controlled value' : undefined}
        />
      </Fragment>
    );
  }
}
