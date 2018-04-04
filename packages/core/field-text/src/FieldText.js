// @flow

import React, { Component } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import FieldTextStateless from './FieldTextStateless';
import type { FieldTextProps } from './types';

type State = {
  value?: string | number,
};
export default class FieldText extends Component<FieldTextProps, State> {
  static defaultProps = {
    onChange: () => {},
  };

  state = {
    value: this.props.value,
  };

  handleOnChange = (e: any, analyticsEvent: UIAnalyticsEvent) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e, analyticsEvent);
    }
  };

  render() {
    return (
      <FieldTextStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
      />
    );
  }
}
