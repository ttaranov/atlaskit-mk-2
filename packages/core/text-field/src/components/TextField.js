// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import DefaultInput from './Input';
import { Wrapper } from '../styled';

type State = {
  value: string,
  isFocused: boolean,
};

type Props = {
  /** Controls the appearance of the field. `subtle` shows styling on hover. `none` hides all field styling. */
  appearance?: 'standard' | 'none' | 'subtle',
  /** applies compact styling, making the field smaller */
  defaultValue: string,
  input: typeof DefaultInput,
  isCompact?: boolean,
  isFocused: boolean,
  isReadOnly: boolean,
  onBlur?: (SyntheticEvent<*>) => void,
  onChange: (SyntheticEvent<*>) => void,
  onFocus?: (SyntheticEvent<*>) => void,
  maxWidth: number,
  value?: string | number,
};

class TextField extends Component<Props, State> {
  static defaultProps = {
    appearance: 'standard',
    input: DefaultInput,
    onChange: () => {},
  };

  state = {
    value: this.props.defaultValue || '',
    isFocused: false,
  };

  input: ?HTMLInputElement;

  getValue = () => {
    return this.props.value || this.state.value;
  };

  handleOnFocus = (e: SyntheticEvent<*>) => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  handleOnBlur = (e: SyntheticEvent<*>) => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  handleOnChange = (e: SyntheticEvent<*>) => {
    this.setState({ value: e.currentTarget.value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  setInputRef = (input: ?HTMLInputElement) => {
    this.input = input;
    // $FlowFixMe - Cannot call `this.props.innerRef` because undefined [1] is not a function
    this.props.innerRef(input);
  };

  render() {
    const { isFocused } = this.state;
    const { maxWidth, input: Input, ...rest } = this.props;

    return (
      <Wrapper maxWidth={maxWidth}>
        <Input
          {...rest}
          isFocused={isFocused}
          ref={this.setInputRef}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          value={this.getValue()}
        />
      </Wrapper>
    );
  }
}

export { TextField as TextFieldWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'textField',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textField',

      attributes: {
        componentName: 'textField',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textField',

      attributes: {
        componentName: 'textField',
        packageName,
        packageVersion,
      },
    }),
  })(TextField),
);
