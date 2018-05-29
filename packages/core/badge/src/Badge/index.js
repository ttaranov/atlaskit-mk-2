// @flow

import { Appearance } from '@atlaskit/theme';
import React, { PureComponent, type Node } from 'react';
import { Max } from '@atlaskit/format';
import { BadgeElement } from './styled';
import * as theme from '../theme';

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

  /** Badge accepts any type of children. If you want formatting, you can
  compose in any sort of component that you want such as @atlaskit/format
  for formatting content. */
  children: Node,

  /** DEPRECATED - use `Max` from `@atlaskit/format`. The maximum value to display. If value is 100, and max is 50, "50+" will
   be displayed */
  max: number,

  /** DEPREACATED - this handler is unnecessary as you already know the value
  and this component does not have any internal state.

  Handler function to be called when the value prop is changed.
  Called with fn({ oldValue, newValue }) */
  onValueUpdated?: ({ oldValue: number, newValue: number }) => any,

  /** DEPRECATED - use `Max` from `@atlaskit/format`. The value displayed within the badge. */
  value: number,
};

export default class Badge extends PureComponent<Props> {
  static defaultProps = {
    appearance: 'default',
    children: null,
    max: 99,
    value: 0,
  };

  // TODO This can be removed when we remove support for onValueUpdated.
  componentWillUpdate(nextProps: Props) {
    const { onValueUpdated, value: oldValue } = this.props;
    const { value: newValue } = nextProps;

    if (onValueUpdated && newValue !== oldValue) {
      onValueUpdated({ oldValue, newValue });
    }
  }

  render() {
    const { appearance, children, max, value } = this.props;

    // The usage of Max is temporary until we remove support for that. It's
    // used here so that we don't have to duplicate the logic.
    //
    // It's also worth nothing that we have to special-case some values. For
    // example, negative values are presented as "0". This might be a spot
    // for a a future abstraction once removed, if we need this functionality.
    const formatted = children ? (
      children
    ) : (
      <Max limit={max === 0 ? undefined : max}>{value < 0 ? 0 : value}</Max>
    );
    return (
      <Appearance props={appearance} theme={theme}>
        {styleProps => <BadgeElement {...styleProps}>{formatted}</BadgeElement>}
      </Appearance>
    );
  }
}
