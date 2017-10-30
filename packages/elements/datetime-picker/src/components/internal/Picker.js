// @flow

import React, { Component } from 'react';
import Base from '@atlaskit/field-base';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { akColorN60 } from '@atlaskit/util-shared-styles';
import type { Handler } from '../../types';

type Props = {
  value: ?string,
  displayValue: string,
  isDisabled: bool,
  isOpen: bool,
  shouldShowIcon: bool,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldTriggerOpen: Handler,
  onIconClick: Handler,
  onPickerBlur: Handler,
  onPickerTriggerClose: Handler,
  onPickerUpdate: Handler,
  dialog: any, // TODO: typing
  field: any,
};

export default class BasePicker extends Component<Props> {
  props: Props;
  dialog: any;
  field: any;

  static defaultProps = {
    value: null,
    displayValue: '',
    isDisabled: false,
    isOpen: false,
    shouldShowIcon: false,
    onFieldBlur() {},
    onFieldChange() {},
    onFieldTriggerOpen() {},
    onIconClick() {},
    onPickerBlur() {},
    onPickerTriggerClose() {},
    onPickerUpdate() {},
  }

  // Use a MouseDown event instead of a Click event so it is fired before the Blur event.
  handleIconMouseDown = (e: MouseEvent) => {
    if (!this.props.isDisabled) {
      e.preventDefault();
      this.props.onIconClick(e);
    }
  }

  maybeRenderIcon() {
    if (!this.props.shouldShowIcon) {
      return null;
    }

    // Wrapping div to ensure the icon stays at full width
    // TODO: i18n label
    return (
      <div
        role="presentation"
        style={{ minWidth: '24px' }}
        onMouseDown={this.handleIconMouseDown}
      >
        <CalendarIcon
          label="Show calendar"
          primaryColor={this.props.isDisabled ? akColorN60 : undefined}
        />
      </div>
    );
  }

  selectField = () => {
    this.field.select();
  }

  render() {
    const Dialog = this.props.dialog;
    const Field = this.props.field;

    return (
      <Dialog
        value={this.props.value}
        isOpen={this.props.isOpen}
        onBlur={this.props.onPickerBlur}
        onTriggerClose={this.props.onPickerTriggerClose}
        onUpdate={this.props.onPickerUpdate}
        ref={ref => { this.dialog = ref; }}
      >
        <Base>
          <Field
            onBlur={this.props.onFieldBlur}
            onChange={this.props.onFieldChange}
            onTriggerOpen={this.props.onFieldTriggerOpen}
            value={this.props.displayValue}
            ref={ref => { this.field = ref; }}
          />
          {this.maybeRenderIcon()}
        </Base>
      </Dialog>
    );
  }
}

