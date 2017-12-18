// @flow

import React, { Component, type ElementRef } from 'react';
import Base from '@atlaskit/field-base';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { colors, gridSize } from '@atlaskit/theme';
import type { Handler } from '../../types';

type DialogProps = {
  [string]: any,
};
export type Props = {
  autoFocus: boolean,
  active: 0 | 1 | 2, // todo: boolean???
  value: [?string, ?string],
  displayValue: [string, string],
  isDisabled: boolean,
  isOpen: boolean,
  shouldShowIcon: boolean,
  width: number,
  onBlur: Handler,
  onIconClick: Handler,
  onFieldBlur: [Handler, Handler],
  onFieldChange: [Handler, Handler],
  onFieldFocus: [Handler, Handler],
  onFieldKeyDown: [Handler, Handler],
  onFieldTriggerOpen: [Handler, Handler],
  onFieldTriggerValidate: [Handler, Handler],
  onPickerBlur: [Handler, Handler],
  onPickerTriggerClose: [Handler, Handler],
  onPickerUpdate: [Handler, Handler],
  dialogs: [ElementRef<any>, ElementRef<any>],
  fields: [ElementRef<any>, ElementRef<any>],
  dialogProps: [DialogProps, DialogProps],
};

const noop = () => {};

export default class PickerDual extends Component<Props> {
  dialog1: ?ElementRef<any>;
  dialog2: ?ElementRef<any>;
  field1: ?ElementRef<any>;
  field2: ?ElementRef<any>;

  static defaultProps = {
    autoFocus: false,
    active: 1,
    value: [null, null],
    displayValue: ['', ''],
    isDisabled: false,
    isOpen: false,
    shouldShowIcon: false,
    width: null,
    onBlur: noop,
    onIconClick: noop,
    dialogProps: [{}, {}],
    onFieldBlur: [noop, noop],
    onFieldChange: [noop, noop],
    onFieldFocus: [noop, noop],
    onFieldKeyDown: [noop, noop],
    onFieldTriggerOpen: [noop, noop],
    onFieldTriggerValidate: [noop, noop],
    onPickerBlur: [noop, noop],
    onPickerTriggerClose: [noop, noop],
    onPickerUpdate: [noop, noop],
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
          primaryColor={this.props.isDisabled ? colors.N60 : undefined}
        />
      </div>
    );
  }

  selectField1 = () => {
    if (this.field1) {
      this.field1.select();
    }
  };

  selectField2 = () => {
    if (this.field2) {
      this.field2.select();
    }
  };

  getFieldWidth() {
    if (!this.props.width) {
      return undefined;
    }

    let fieldWidth = this.props.width - gridSize() * 2;
    if (this.props.shouldShowIcon) {
      fieldWidth -= gridSize() * 3;
    }
    return fieldWidth / 2;
  }

  render() {
    const Dialog1 = this.props.dialogs[0];
    const Dialog2 = this.props.dialogs[1];
    const Field1 = this.props.fields[0];
    const Field2 = this.props.fields[1];

    return (
      <Dialog2
        value={this.props.value[1]}
        isOpen={this.props.isOpen && this.props.active === 2}
        onBlur={this.props.onPickerBlur[1]}
        onTriggerClose={this.props.onPickerTriggerClose[1]}
        onUpdate={this.props.onPickerUpdate[1]}
        width={this.props.width}
        {...this.props.dialogProps[1]}
        ref={ref => {
          this.dialog2 = ref;
        }}
      >
        <Dialog1
          value={this.props.value[0]}
          isOpen={this.props.isOpen && this.props.active === 1}
          onBlur={this.props.onPickerBlur[0]}
          onTriggerClose={this.props.onPickerTriggerClose[0]}
          onUpdate={this.props.onPickerUpdate[0]}
          width={this.props.width}
          {...this.props.dialogProps[0]}
          ref={ref => {
            this.dialog1 = ref;
          }}
        >
          <Base isDisabled={this.props.isDisabled} onBlur={this.props.onBlur}>
            <Field1
              autoFocus={this.props.autoFocus}
              onBlur={this.props.onFieldBlur[0]}
              onChange={this.props.onFieldChange[0]}
              onFocus={this.props.onFieldFocus[0]}
              onKeyDown={this.props.onFieldKeyDown[0]}
              onTriggerOpen={this.props.onFieldTriggerOpen[0]}
              onTriggerValidate={this.props.onFieldTriggerValidate[0]}
              value={this.props.displayValue[0]}
              isActive={this.props.active !== 2}
              width={this.getFieldWidth()}
              ref={ref => {
                this.field1 = ref;
              }}
            />
            <Field2
              onBlur={this.props.onFieldBlur[1]}
              onChange={this.props.onFieldChange[1]}
              onFocus={this.props.onFieldFocus[1]}
              onKeyDown={this.props.onFieldKeyDown[1]}
              onTriggerOpen={this.props.onFieldTriggerOpen[1]}
              onTriggerValidate={this.props.onFieldTriggerValidate[1]}
              value={this.props.displayValue[1]}
              isActive={this.props.active !== 1}
              width={this.getFieldWidth()}
              ref={ref => {
                this.field2 = ref;
              }}
            />
            {this.maybeRenderIcon()}
          </Base>
        </Dialog1>
      </Dialog2>
    );
  }
}
