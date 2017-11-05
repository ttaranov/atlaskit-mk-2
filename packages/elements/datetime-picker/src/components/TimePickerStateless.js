// @flow

import React, { Component, type ElementRef } from 'react';
import Picker from './internal/Picker';
import TimeField from './internal/TimeField';
import TimeDialog from './internal/TimeDialog';
import type { Handler } from '../types';

type Props = {
  value: ?string,
  displayValue: string,
  focused: ?string,
  isOpen: boolean,
  isDisabled: boolean,
  times: Array<string>,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldKeyDown: Handler,
  onIconClick: Handler,
  onPickerUpdate: Handler,
};

export default class TimePickerStateless extends Component<Props> {
  picker: ?ElementRef<typeof Picker>;

  static defaultProps = {
    isDisabled: false,
    isOpen: false,
    value: null,
    displayValue: '',
    focused: null,
    times: [],

    onFieldBlur() {},
    onFieldChange() {},
    onFieldKeyDown() {},
    onIconClick() {},
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
        field={TimeField}
        dialog={TimeDialog}

        isDisabled={this.props.isDisabled}
        isOpen={this.props.isOpen}
        shouldShowIcon
        displayValue={this.props.displayValue}
        value={this.props.value}
        dialogProps={{
          value: this.props.focused,
          times: this.props.times,
        }}

        onFieldBlur={this.props.onFieldBlur}
        onFieldChange={this.props.onFieldChange}
        onFieldKeyDown={this.props.onFieldKeyDown}
        onIconClick={this.props.onIconClick}
        onPickerUpdate={this.props.onPickerUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
