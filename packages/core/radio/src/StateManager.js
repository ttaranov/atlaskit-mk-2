// @flow
import React, {
  Component,
  type ComponentType,
  type ElementConfig,
} from 'react';
import RadioGroup from './RadioGroup';

type StateManagerProps = {
  selectedValue?: string | number | null,
  defaultSelectedValue: string | number | null,
  onChange?: (event: SyntheticEvent<*>) => void,
};

type State = {
  selectedValue: string | number | null,
};

export default (
  WrappedComponent: ComponentType<ElementConfig<typeof RadioGroup>>,
): ComponentType<StateManagerProps> => {
  return class StateManager extends Component<StateManagerProps, State> {
    static defaultProps = {
      defaultSelectedValue: null,
    };
    state = {
      selectedValue:
        this.props.selectedValue !== undefined
          ? this.props.selectedValue
          : this.props.defaultSelectedValue,
    };
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
};
