// @flow

import { Appearance } from '@atlaskit/theme';
import React, { PureComponent } from 'react';
import { BadgeElement } from './styled';
import * as theme from '../theme';

function getValue(value, max) {
  if (value < 0) {
    return '0';
  }
  if (max > 0 && value > max) {
    return `${max}+`;
  }
  if (value === Infinity) {
    return '∞';
  }
  return String(value);
}

type Props = {
  /** Affects the visual style of the badge.*/
  appearance:
    | 'default'
    | 'primary'
    | 'primaryInverted'
    | 'important'
    | 'added'
    | 'removed'
    | {},

  /** The maximum value to display. If value is 100, and max is 50, "50+" will
   be displayed */
  max: number,

  /** DEPREACATED - this handler is unnecessary as you already know the value
  and this component does not have any internal state.

  Handler function to be called when the value prop is changed.
  Called with fn({ oldValue, newValue }) */

  onValueUpdated?: ({ oldValue: number, newValue: number }) => any,
  /** The value displayed within the badge. */
  value: number,
};

export default class Badge extends PureComponent<Props> {
  static defaultProps = {
    appearance: 'default',
    max: 99,
    value: 0,
  };

  componentWillUpdate(nextProps: Props) {
    const { onValueUpdated, value: oldValue } = this.props;
    const { value: newValue } = nextProps;

    if (onValueUpdated && newValue !== oldValue) {
      onValueUpdated({ oldValue, newValue });
    }
  }

  render() {
    const { appearance, max, value } = this.props;
    const computedValue = getValue(value, max);
    return (
      <Appearance props={appearance} theme={theme}>
        {styleProps => (
          <BadgeElement {...styleProps}>{computedValue}</BadgeElement>
        )}
      </Appearance>
    );
  }
}
