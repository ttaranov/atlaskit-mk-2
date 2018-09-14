// @flow
import React, { Component, Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxSelect } from '../src';

// data imported for brevity; equal to the options from Single Select example

const customGetOptionLabel = option => {
  return option.label.length >= 10
    ? `${option.label.substring(0, 7)}...`
    : option.label;
};
export default class withCustomGetOptionLabel extends Component<
  *,
  { useCustomOptionLabel: boolean },
> {
  state = {
    useCustomOptionLabel: true,
  };
  toggleValue = ({ value }: Object) =>
    this.setState(state => ({ ...state, [value]: !state[value] }));
  render() {
    return (
      <Fragment>
        {this.state.useCustomOptionLabel ? (
          <CheckboxSelect
            options={[
              {
                label:
                  'THIS IS A REALLY LONG LABEL FOR A REALLY NOT SO LONG VALUE',
                value: 'one',
              },
            ]}
            placeholder="Choose a City"
            getOptionLabel={customGetOptionLabel}
          />
        ) : (
          <CheckboxSelect
            options={[
              {
                label:
                  'THIS IS A REALLY LONG LABEL FOR A REALLY NOT SO LONG VALUE',
                value: 'one',
              },
            ]}
            placeholder="Choose a City"
          />
        )}

        <Checkbox
          value="useCustomOptionLabel"
          label="Define custom getOptionLabel"
          name="defineCustomGetOptionLabel"
          onChange={this.toggleValue}
        />
      </Fragment>
    );
  }
}
