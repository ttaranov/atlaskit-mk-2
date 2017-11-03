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
  width: number,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldKeyDown: Handler,
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
    width: null,

    onFieldBlur() {},
    onFieldChange() {},
    onFieldKeyDown() {},
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
        displayValue={this.props.displayValue}
        value={this.props.value}
        dialogProps={{
          value: this.props.focused,
          times: this.props.times,
        }}
        width={this.props.width}

        onFieldBlur={this.props.onFieldBlur}
        onFieldChange={this.props.onFieldChange}
        onFieldKeyDown={this.props.onFieldKeyDown}
        onPickerUpdate={this.props.onPickerUpdate}

        ref={ref => { this.picker = ref; }}
      />
    );
  }
}
