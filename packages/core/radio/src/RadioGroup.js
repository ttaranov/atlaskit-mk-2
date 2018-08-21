// @flow
import React, { Component, Fragment, type Element } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import stateManager from './StateManager';
import Radio from './Radio';
import type { ItemPropType } from './types';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
/* eslint-disable react/no-array-index-key */

export type RadioGroupProps = {
  selectedValue?: string | number | null,
  onChange: (event: SyntheticEvent<*>) => void,
  isRequired?: boolean,
  items: Array<ItemPropType>,
};

type RadioElementArray = Array<Element<typeof Radio>>;

class RadioGroup extends Component<RadioGroupProps> {
  static defaultProps = {
    onChange: () => {},
  };

  items: RadioElementArray = [];

  buildItems = (props: RadioGroupProps) => {
    return (props.items.map((item: ItemPropType, index: number) => {
      if (item.value === props.selectedValue) {
        const itemProps = { ...item, isChecked: true };
        return (
          <Radio
            key={index}
            onChange={props.onChange}
            {...itemProps}
            isRequired={props.isRequired}
          >
            {item.label}
          </Radio>
        );
      }
      return (
        <Radio
          key={index}
          onChange={props.onChange}
          {...item}
          isRequired={props.isRequired}
        >
          {item.label}
        </Radio>
      );
    }): RadioElementArray);
  };

  render() {
    const items = this.buildItems(this.props);
    return <Fragment>{items.length ? items : null}</Fragment>;
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'RadioGroup',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'selected',
      actionSubject: 'radioItem',
      attribute: {
        componentName: 'RadioGroup',
        packageName,
        packageVersion,
      },
    }),
  })(stateManager(RadioGroup)),
);
