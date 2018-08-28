// @flow
import React, { Component, Fragment, type Element } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Radio from './Radio';
import type { OptionsPropType, OptionPropType } from './types';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
/* eslint-disable react/no-array-index-key */

export type RadioGroupProps = {
  defaultSelectedValue?: string | number | null,
  isRequired?: boolean,
  options: OptionsPropType,
  onInvalid?: (event: SyntheticEvent<*>) => void,
  onChange: (event: SyntheticEvent<*>) => void,
  selectedValue?: string | number | null,
};

type RadioElementArray = Array<Element<typeof Radio>>;

type State = { selectedValue?: string | number | null };

class RadioGroup extends Component<RadioGroupProps, State> {
  static defaultProps = {
    onChange: () => {},
    options: [],
  };

  constructor(props: RadioGroupProps) {
    super(props);
    this.state = {
      selectedValue:
        this.props.selectedValue !== undefined
          ? this.props.selectedValue
          : this.props.defaultSelectedValue,
    };
  }

  getProp = (key: string) => {
    return this.props[key] ? this.props[key] : this.state[key];
  };

  onChange = (event: SyntheticEvent<*>) => {
    this.setState({
      selectedValue: event.currentTarget.value,
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event);
    }
  };

  buildOptions = () => {
    const { options, isRequired, onInvalid } = this.props;
    const selectedValue = this.getProp('selectedValue');
    if (!options.length) return null;

    return (options.map((option: OptionPropType, index: number) => {
      let optionProps = { ...option };
      if (option.value === selectedValue) {
        optionProps = { ...option, isChecked: true };
      }
      return (
        <Radio
          key={index}
          onChange={this.onChange}
          {...optionProps}
          onInvalid={onInvalid}
          isRequired={isRequired}
        >
          {option.label}
        </Radio>
      );
    }): RadioElementArray);
  };

  render() {
    const options = this.buildOptions();
    return <Fragment>{options}</Fragment>;
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export const RadioGroupWithoutAnalytics = RadioGroup;
export default withAnalyticsContext({
  componentName: 'radioGroup',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'selected',
      actionSubject: 'radioItem',
      attributes: {
        componentName: 'radioGroup',
        packageName,
        packageVersion,
      },
    }),
  })(RadioGroupWithoutAnalytics),
);
