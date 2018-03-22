// @flow

import React, { Component, Fragment } from 'react';
import Checkbox from '@atlaskit/checkbox';
import { AsyncCreatableSelect as AsyncCreatable } from '../src';

import { cities } from './common/data';

// you control how the options are filtered
const filter = (inputValue: string) =>
  cities.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// async load function using callback (promises also supported)
const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filter(inputValue));
  }, 1000);
};

type State = {
  allowCreateWhileLoading: boolean,
};

export default class AsyncCreatableExample extends Component<*, State> {
  state = {
    allowCreateWhileLoading: false,
    options: cities,
  };
  handleCreateOption = inputValue => {
    this.setState(state => ({
      ...state,
      options: [inputValue, ...state.options],
    }));
  };
  toggleValue = event => {
    this.setState(state => ({ ...state, [event.value]: !state[event.value] }));
  };
  render() {
    const { allowCreateWhileLoading } = this.state;
    return (
      <Fragment>
        <AsyncCreatable
          defaultOptions
          loadOptions={loadOptions}
          allowCreateWhileLoading={allowCreateWhileLoading}
          options={cities}
          onCreateOption={this.handleCreateOption}
          placeholder="Choose a City"
        />
        <Checkbox
          value="allowCreateWhileLoading"
          label="Allow create while loading"
          name="allowCreateWhileLoading"
          onChange={this.toggleValue}
        />
      </Fragment>
    );
  }
}
