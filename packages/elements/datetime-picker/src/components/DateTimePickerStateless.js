// @flow

import React, { Component } from 'react';
import DateDialog from './internal/DateDialog';
import DateField from './internal/DateField';
import DualPicker, { type Props } from './internal/DualPicker';
import TimeDialog from './internal/TimeDialog';
import TimeField from './internal/TimeField';

export default class DateTimePickerStateless extends Component<Props> {
  render() {
    return (
      <DualPicker
        {...this.props}
        dialogs={[DateDialog, TimeDialog]}
        fields={[DateField, TimeField]}
        shouldShowIcon
      />
    );
  }
}
