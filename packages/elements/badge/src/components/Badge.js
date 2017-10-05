// @flow
import React, { PureComponent } from 'react';
import BadgeElement from '../styled/Badge';

export const APPEARANCE_ENUM = {
  values: ['default', 'primary', 'primaryInverted', 'important', 'added', 'removed'],
  defaultValue: 'default',
};

function validAppearance(value) {
  return value && APPEARANCE_ENUM.values.includes(value)
    ? value
    : APPEARANCE_ENUM.defaultValue;
}

function getValue(value, max) {
  if (value < 0) {
    return '0';
  }
  if (max > 0 && value > max) {
    return `${max}+`;
  }
  if (value === Infinity) {
    return '\u221E'; // ∞ inifinity character
  }
  return String(value);
}

type Props = {
  /** Affects the visual style of the badge */
  appearance: 'default' | 'primary' | 'primaryInverted' | 'important' | 'added' | 'removed',
  /** The maximum value to display. If value is 100, and max is 50,
      "50+" will be displayed */
  max: number,
  /** Handler function to be called when the value prop is changed.
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
  }

  componentWillUpdate(nextProps: Props) {
    const { onValueUpdated, value: oldValue } = this.props;
    const { value: newValue } = nextProps;

    if (onValueUpdated && newValue !== oldValue) {
      onValueUpdated({ oldValue, newValue });
    }
  }

  render() {
    const { appearance, max, value } = this.props;

    return (
      <BadgeElement appearance={validAppearance(appearance)}>
        {getValue(value, max)}
      </BadgeElement>
    );
  }
}
