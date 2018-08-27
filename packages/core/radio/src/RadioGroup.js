// @flow
import React, { Component, Fragment, type Element } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Radio from './Radio';
import type { ItemPropType } from './types';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
/* eslint-disable react/no-array-index-key */

export type RadioGroupProps = {
  defaultSelectedValue?: string | number | null,
  isRequired?: boolean,
  items: Array<ItemPropType>,
  onChange: (event: SyntheticEvent<*>) => void,
  selectedValue?: string | number | null,
};

type RadioElementArray = Array<Element<typeof Radio>>;

type State = { selectedValue?: string | number | null };

class RadioGroup extends Component<RadioGroupProps, State> {
  static defaultProps = {
    onChange: () => {},
    items: [],
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

  items: RadioElementArray = [];

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

  buildItems = () => {
    const { items, isRequired } = this.props;
    const selectedValue = this.getProp('selectedValue');
    if (!items.length) return null;

    return (items.map((item: ItemPropType, index: number) => {
      let itemProps = { ...item };
      if (item.value === selectedValue) {
        itemProps = { ...item, isChecked: true };
      }
      return (
        <Radio
          key={index}
          onChange={this.onChange}
          {...itemProps}
          isRequired={isRequired}
        >
          {item.label}
        </Radio>
      );
    }): RadioElementArray);
  };

  render() {
    const items = this.buildItems();
    return <Fragment>{items}</Fragment>;
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
