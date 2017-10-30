// @flow

import React, { Component } from 'react';
// import type { EventChange, EventSelect } from '@atlaskit/calendar';
// import { parse, format, isValid, getDate, getMonth, getYear } from 'date-fns';
import BasePicker from './internal/Picker';
import DateField from './internal/DateField';
import DateDialog from './internal/DateDialog';
// import type { Handler } from '../types';

type Props = {
  isDisabled: boolean,
  disabled: Array<string>,
  onChange: Handler,
  onIconClick: Handler,

  onIconClick: Handler,
  onFieldChange: Handler,
  onPickerUpdate: Handler,
  onTriggerOpen: Handler,
  onTriggerClose: Handler,
};

export default class DatePickerStateless extends Component<Props> {
  props: Props;

  static defaultProps = {
    isDisabled: false,
    disabled: [],
    onChange() {},
  }

  render() {
    return (
      <BasePicker

        shouldShowIcon
        field={DateField}
        dialog={DateDialog}
      />
    );
  }
}
