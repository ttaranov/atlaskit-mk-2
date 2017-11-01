// @flow

import React, { Component } from 'react';
// import type { EventChange, EventSelect } from '@atlaskit/calendar';
import BasePicker from './internal/Picker';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
import type { Handler } from '../types';

type Props = {
  value: ?string,
  displayValue: string,
  isOpen: boolean,
  isDisabled: boolean,
  disabled: Array<string>,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldTriggerOpen: Handler,
  onIconClick: Handler,
  onPickerBlur: Handler,
  onPickerTriggerClose: Handler,
  onPickerUpdate: Handler,
};

export default class DatePickerStateless extends Component<Props> {
  props: Props;
  picker: any;

  static defaultProps = {
    isDisabled: false,
    isOpen: false,
    value: null,
    displayValue: '',
    disabled: [],

    onFieldBlur() {},
    onFieldChange() {},
    onFieldTriggerOpen() {},
    onIconClick() {},
    onPickerBlur() {},
    onPickerTriggerClose() {},
    onPickerUpdate() {},
  }

  selectField() {
    if (this.picker) {
      this.picker.selectField();
    }
  }

  render() {
    return (
      <BasePicker
        field={DateField}
        dialog={DateDialog}

        isDisabled={this.props.isDisabled}
        isOpen={this.props.isOpen}
        shouldShowIcon
        displayValue={this.props.displayValue}
        value={this.props.value}
        dialogProps={{ disabled: this.props.disabled }}

        onFieldBlur={this.props.onFieldBlur}
        onFieldChange={this.props.onFieldChange}
        onFieldTriggerOpen={this.props.onFieldTriggerOpen}
        onIconClick={this.props.onIconClick}
        onPickerBlur={this.props.onPickerBlur}
        onPickerTriggerClose={this.props.onPickerTriggerClose}
        onPickerUpdate={this.props.onPickerUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
