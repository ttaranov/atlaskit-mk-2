// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Checkbox, { CheckboxStateless, CheckboxGroup } from '../src';
import { name } from '../package.json';
import { borderRadius, colors } from '@atlaskit/theme';
const containerStyle = {
  padding: 20,
  backgroundColor: 'white',
  width: 500,
};

type State = {
  isChecked: boolean,
  onChangeResult: string,
};

export default class StatelessExample extends PureComponent<void, State> {
  state = {
    isChecked: false,
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };
  onChange = (event: any) => {
    this.setState({
      isChecked: !this.state.isChecked,
      onChangeResult:
        'onChange Event with currentTarget.checked:' +
        event.currentTarget.checked,
    });
  };

  render() {
    return (
      <div>
        <CheckboxStateless
          isChecked={this.state.isChecked}
          onChange={this.onChange}
          label="Stateless Checkbox"
          value="Stateless Checkbox"
          name="stateless-checkbox"
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            margin: '0.5em',
            color: '#ccc',
          }}
        >
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
