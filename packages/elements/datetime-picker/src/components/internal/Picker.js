// @flow

import React, { Component, type ElementRef } from 'react';
import Base from '@atlaskit/field-base';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { akColorN60, akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import type { Handler } from '../../types';

type Props = {
  value: ?string,
  displayValue: string,
  isDisabled: boolean,
  isOpen: boolean,
  shouldShowIcon: boolean,
  onFieldBlur: Handler,
  onFieldChange: Handler,
  onFieldKeyDown: Handler,
  onFieldTriggerOpen: Handler,
  onIconClick: Handler,
  onPickerBlur: Handler,
  onPickerTriggerClose: Handler,
  onFieldTriggerValidate: Handler,
  onPickerUpdate: Handler,
  dialog: ElementRef<any>,
  field: ElementRef<any>,
  dialogProps: { [string]: any },
  width: ?number,
};

export default class Picker extends Component<Props> {
  dialog: ?ElementRef<any>;
  field: ?ElementRef<any>;

  static defaultProps = {
    value: null,
    displayValue: '',
    isDisabled: false,
    isOpen: false,
    shouldShowIcon: false,
    dialogProps: {},
    width: null,
    onFieldBlur() {},
    onFieldChange() {},
    onFieldKeyDown() {},
    onFieldTriggerOpen() {},
    onFieldTriggerValidate() {},
    onIconClick() {},
    onPickerBlur() {},
    onPickerTriggerClose() {},
    onPickerUpdate() {},
  };

  // Use a MouseDown event instead of a Click event so it is fired before the Blur event.
  handleIconMouseDown = (e: MouseEvent) => {
    if (!this.props.isDisabled) {
      e.preventDefault();
      this.props.onIconClick(e);
    }
  };

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
    if (this.field) {
      this.field.select();
    }
  };

  getFieldWidth() {
    if (!this.props.width) {
      return undefined;
    }

    let fieldWidth = this.props.width - akGridSizeUnitless * 2;
    if (this.props.shouldShowIcon) {
      fieldWidth -= akGridSizeUnitless * 3;
    }
    return fieldWidth;
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
        width={this.props.width}
        {...this.props.dialogProps}
        ref={ref => {
          this.dialog = ref;
        }}
      >
        <Base isDisabled={this.props.isDisabled}>
          <Field
            onBlur={this.props.onFieldBlur}
            onChange={this.props.onFieldChange}
            onKeyDown={this.props.onFieldKeyDown}
            onTriggerOpen={this.props.onFieldTriggerOpen}
            onTriggerValidate={this.props.onFieldTriggerValidate}
            value={this.props.displayValue}
            width={this.getFieldWidth()}
            ref={ref => {
              this.field = ref;
            }}
          />
          {this.maybeRenderIcon()}
        </Base>
      </Dialog>
    );
  }
}
