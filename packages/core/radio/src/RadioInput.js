// @flow
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

import RadioIcon from './RadioIcon';
import { HiddenInput } from './styled/Radio';
import type { RadioInputProps } from './types';

class RadioInput extends Component<RadioInputProps> {
  render() {
    const {
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isHovered,
      isInvalid,
      isRequired,
      label,
      name,
      onChange,
      onInvalid,
      onBlur,
      onFocus,
      value,
    } = this.props;

    return (
      <span
        style={{
          flexShrink: 0,
          display: 'inline-block',
          position: 'relative',
        }}
      >
        <HiddenInput
          aria-label={label}
          checked={isChecked}
          disabled={isDisabled}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          onInvalid={onInvalid}
          onFocus={onFocus}
          required={isRequired}
          type="radio"
          value={value}
        />
        <RadioIcon
          isActive={isActive}
          isChecked={isChecked}
          isDisabled={isDisabled}
          isFocused={isFocused}
          isHovered={isHovered}
          isInvalid={isInvalid}
        />
      </span>
    );
  }
}

export const RadioInputWithoutAnalytics = RadioInput;
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
  componentName: 'radioInput',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'isChecked',
      actionSubject: 'radioInput',
      attributes: {
        componentName: 'radioInput',
        packageName,
        packageVersion,
      },
    }),
  })(RadioInput),
);
