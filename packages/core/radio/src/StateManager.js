// @flow
import React, { Component, type ComponentType } from 'react';
import { type RadioGroupProps } from './RadioGroup';

type StateManagerProps = {
  ...RadioGroupProps,
  defaultSelectedValue: string | number | null,
};

type State = {
  selectedValue: string | number | null,
};

export default function(WrappedComponent: ComponentType<RadioGroupProps>) {
  return class StateManager extends Component<StateManagerProps, State> {
    static defaultProps = {
      defaultSelectedValue: null,
    };

    constructor(props: StateManagerProps) {
      super(props);
      this.state = {
        selectedValue:
          props.selectedValue !== undefined
            ? props.selectedValue
            : props.defaultSelectedValue,
      };
    }

    getProp = (key: string) => {
      return this.props[key] !== undefined ? this.props[key] : this.state[key];
    };
    onChange = (event: SyntheticEvent<*>) => {
      this.setState({
        selectedValue: event.currentTarget.value,
      });
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event);
      }
    };
    render() {
      const { selectedValue, defaultSelectedValue, ...props } = this.props;
      return (
        <WrappedComponent
          {...props}
          selectedValue={this.getProp('selectedValue')}
          onChange={this.onChange}
        />
      );
    }
  };
}
