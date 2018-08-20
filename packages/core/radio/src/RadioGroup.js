// @flow
import React, { Component, Fragment, type Element } from 'react';
import { Label } from './styled/Radio';
import stateManager from './StateManager';
import Radio from './Radio';
import type { ItemPropType } from './types';
/* eslint-disable react/no-array-index-key */

type Props = {
  selectedValue: string,
  onChange: (event: SyntheticEvent<*>) => void,
  label: string,
  isRequired: boolean,
  items: Array<ItemPropType>,
};

type RadioElementArray = Array<Element<typeof Radio>>;

class RadioGroup extends Component<Props> {
  static defaultProps = {
    onChange: () => {},
  };

  items: RadioElementArray = [];

  buildItems = (props: Props) => {
    return (props.items.map((item: ItemPropType, index: number) => {
      if (item.value === props.selectedValue) {
        return (
          <Radio
            key={index}
            onChange={props.onChange}
            {...{ ...item, isChecked: true }}
          >
            {item.label}
          </Radio>
        );
      }
      return (
        <Radio key={index} onChange={props.onChange} {...item}>
          {item.label}
        </Radio>
      );
    }): RadioElementArray);
  };

  render() {
    const items = this.buildItems(this.props);
    return (
      <Fragment>
        <Label>{this.props.label}</Label>
        <div>
          <div aria-label={this.props.label} role="group">
            {items.length ? items : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default stateManager(RadioGroup);
