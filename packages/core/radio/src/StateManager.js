// @flow
import React, {
  Component,
  type ComponentType,
  type ElementConfig,
} from 'react';
import RadioGroup from './RadioGroup';

type Props = {
  selectedValue?: string,
  defaultSelectedValue: string,
  onChange?: (event: SyntheticEvent<*>) => void,
};

type State = {
  selectedValue: string,
};

export default (
  WrappedComponent: ComponentType<ElementConfig<typeof RadioGroup>>,
) => {
  return class StateManager extends Component<Props, State> {
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
