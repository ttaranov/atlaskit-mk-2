// @flow

import React, { PureComponent } from 'react';
import FieldTextStateless from './FieldTextStateless';
import type { FieldTextProps } from '../types';

/* eslint-disable react/prop-types */
export default class FieldText extends PureComponent {
  props: FieldTextProps // eslint-disable-line react/sort-comp

  static defaultProps = {
    onChange: () => {},
  }

  input: ?HTMLInputElement

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  state = {
    value: this.props.value,
  }

  handleOnChange = (e: Event) => {
    this.setState({ value: e.target.value });
    this.props.onChange(e);
  }

  render() {
    return (
      <FieldTextStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
        ref={(fieldRef) => { this.input = fieldRef; }}
      />
    );
  }
}
