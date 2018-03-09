// @flow

import React, { Component } from 'react';
import DateDialog from './internal/DateDialog';
import DateField from './internal/DateField';
import DualPicker, { type Props } from './internal/DualPicker';
import TimeDialog from './internal/TimeDialog';
import TimeField from './internal/TimeField';

export default class DateTimePickerStateless extends Component<Props> {
  dualPicker: any;

  selectDateField() {
    if (this.dualPicker) {
      this.dualPicker.selectField1();
    }
  }

  selectTimeField() {
    if (this.dualPicker) {
      this.dualPicker.selectField2();
    }
  }

  render() {
    return (
      <DualPicker
        {...this.props}
        dialogs={[DateDialog, TimeDialog]}
        fields={[DateField, TimeField]}
        shouldShowIcon
        ref={ref => {
          this.dualPicker = ref;
        }}
      />
    );
  }
}
