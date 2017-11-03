// @flow

import React, { Component, type ElementRef } from 'react';
import Picker from './internal/Picker';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
import type { Handler } from '../types';

type Props = {
  value: ?string,
  displayValue: string,
  isOpen: boolean,
  isDisabled: boolean,
  disabled: Array<string>,
  width: number,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldTriggerOpen: Handler,
  onFieldTriggerValidate: Handler,
  onIconClick: Handler,
  onPickerBlur: Handler,
  onPickerTriggerClose: Handler,
  onPickerUpdate: Handler,
};

export default class DatePickerStateless extends Component<Props> {
  picker: ?ElementRef<typeof Picker>;

  static defaultProps = {
    isDisabled: false,
    isOpen: false,
    value: null,
    displayValue: '',
    disabled: [],
    width: null,

    onFieldBlur() {},
    onFieldChange() {},
    onFieldTriggerOpen() {},
    onFieldTriggerValidate() {},
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
      <Picker
        field={DateField}
        dialog={DateDialog}

        isDisabled={this.props.isDisabled}
        isOpen={this.props.isOpen}
        shouldShowIcon
        displayValue={this.props.displayValue}
        value={this.props.value}
        dialogProps={{ disabled: this.props.disabled }}
        width={this.props.width}

        onFieldBlur={this.props.onFieldBlur}
        onFieldChange={this.props.onFieldChange}
        onFieldTriggerOpen={this.props.onFieldTriggerOpen}
        onFieldTriggerValidate={this.props.onFieldTriggerValidate}
        onIconClick={this.props.onIconClick}
        onPickerBlur={this.props.onPickerBlur}
        onPickerTriggerClose={this.props.onPickerTriggerClose}
        onPickerUpdate={this.props.onPickerUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
