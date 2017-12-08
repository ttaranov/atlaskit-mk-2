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

export default class StatelessExample extends PureComponent {
  state = { isChecked: false };
  onChange = () => {
    console.log('onchange called for', this.props.value);
    this.setState({ isChecked: !this.state.isChecked });
  };

  render() {
    return (
      <CheckboxStateless
        isChecked={this.state.isChecked}
        onChange={this.onChange}
        label="With user managed state"
        value={this.props.value}
        name={this.props.value}
      />
    );
  }
}
