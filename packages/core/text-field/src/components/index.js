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

import { Wrapper } from '../styled';

type State = {
  value: string,
};

type Props = any;

class TextField extends Component<Props, State> {
  static defaultProps = {
    size: 'default',
    onChange: () => {},
  };

  state = {
    value: this.props.defaultValue || '',
  };

  input: ?HTMLInputElement;

  getValue = () => {
    return this.props.value || this.state.value;
  };

  handleOnChange = (e: any) => {
    this.setState({ value: e.target.value });
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
    const { size, input: Input, ...props } = this.props;
    return (
      <Wrapper size={size}>
        <Input
          {...props}
          ref={this.setInputRef}
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
  componentName: 'fieldText',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textField',

      attributes: {
        componentName: 'fieldText',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textField',

      attributes: {
        componentName: 'fieldText',
        packageName,
        packageVersion,
      },
    }),
  })(FieldTextStateless),
);
