// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import Input from './styled/Input';
import type { FieldTextProps } from './types';

export class FieldTextStateless extends Component<FieldTextProps, void> {
  static defaultProps = {
    compact: false,
    disabled: false,
    isInvalid: false,
    isReadOnly: false,
    isSpellCheckEnabled: true,
    onChange: () => {},
    required: false,
    type: 'text',
  };

  input: ?HTMLInputElement;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  handleInputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  render() {
    return (
      <div>
        <Label
          htmlFor={this.props.id}
          isDisabled={this.props.disabled}
          isLabelHidden={this.props.isLabelHidden}
          isRequired={this.props.required}
          label={this.props.label || ''}
        />
        <Base
          invalidMessage={this.props.invalidMessage}
          isCompact={this.props.compact}
          isDisabled={this.props.disabled}
          isFitContainerWidthEnabled={this.props.shouldFitContainer}
          isInvalid={this.props.isInvalid}
          isReadOnly={this.props.isReadOnly}
          isRequired={this.props.required}
        >
          <Input
            autoComplete={this.props.autoComplete}
            autoFocus={this.props.autoFocus}
            disabled={this.props.disabled}
            form={this.props.form}
            id={this.props.id}
            innerRef={this.handleInputRef}
            maxLength={this.props.maxLength}
            min={this.props.min}
            max={this.props.max}
            name={this.props.name}
            onBlur={this.props.onBlur}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onKeyDown={this.props.onKeyDown}
            onKeyPress={this.props.onKeyPress}
            onKeyUp={this.props.onKeyUp}
            pattern={this.props.pattern}
            placeholder={this.props.placeholder}
            readOnly={this.props.isReadOnly}
            required={this.props.required}
            spellCheck={this.props.isSpellCheckEnabled}
            type={this.props.type}
            value={this.props.value}
          />
        </Base>
      </div>
    );
  }
}

export default withAnalyticsContext({
  component: 'field-text',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'blur',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onFocus: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'focus',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onKeyDown: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'keydown',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onKeyPress: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'keypress',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onKeyUp: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'keyup',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(FieldTextStateless),
);
