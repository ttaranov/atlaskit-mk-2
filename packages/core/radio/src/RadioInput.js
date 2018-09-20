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
import { RadioInputWrapper, HiddenInput } from './styled/RadioInput';
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
      ...props
    } = this.props;

    return (
      <RadioInputWrapper>
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
          {...props}
          isActive={isActive}
          isChecked={isChecked}
          isDisabled={isDisabled}
          isFocused={isFocused}
          isHovered={isHovered}
          isInvalid={isInvalid}
        />
      </RadioInputWrapper>
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
