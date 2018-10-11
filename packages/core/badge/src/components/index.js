// @flow

import React, { Component } from 'react';
import { AtlaskitThemeConsumer } from '@atlaskit/theme';
import { Container } from './Container';
import { Format } from './Format';
import {
  defaultTheme,
  noopTheme,
  BadgeThemeConsumer,
  type ThemeAppearance,
  type Styles,
} from '../theme';

type Props = {
  /** Affects the visual style of the badge. */
  appearance: ThemeAppearance,

  /** Supercedes the `value` props. The value displayed within the badge. */
  children: number,

  /** The maximum value to display. If value is 100, and max is 50, "50+" will be displayed */
  max: number,

  /** DEPRECATED - this handler is unnecessary as you already know the value and this component does not have any internal state.

  Handler function to be called when the value prop is changed. Called with fn({ oldValue, newValue }) */
  onValueUpdated: ({
    oldValue: number,
    newValue: number,
  }) => any,

  /** The theme the component should use. */
  theme: ({ appearance: ThemeAppearance }, Styles) => Styles,

  /** DEPRECATED - use `Max` from `@atlaskit/format`. The value displayed within the badge. */
  value?: number,
};

export default class Badge extends Component<Props> {
  static displayName = 'Ak.Badge';
  static defaultProps = {
    appearance: 'default',
    children: 0,
    max: 99,
    onValueUpdated: () => {},
    theme: noopTheme,
    value: undefined,
  };

  // TODO This can be removed when we remove support for onValueUpdated.
  componentWillUpdate(nextProps: Props) {
    const { children, onValueUpdated, value } = this.props;
    let oldValue = children;
    let newValue = nextProps.children;

    // This allows us to still prefer the value prop to maintain backward
    // compatibility.
    if (value != null) {
      oldValue = value;
    }
    if (nextProps.value != null) {
      newValue = nextProps.value;
    }

    if (onValueUpdated && newValue !== oldValue) {
      onValueUpdated({ oldValue, newValue });
    }
  }

  render() {
    const { appearance, children, max, theme: propsTheme, value } = this.props;
    return (
      <AtlaskitThemeConsumer>
        {({ mode }) => (
          <BadgeThemeConsumer>
            {contextTheme => (
              <Container
                {...[defaultTheme(mode), contextTheme, propsTheme].reduce(
                  (styles, themeFn) => themeFn({ appearance }, styles),
                  {},
                )}
              >
                <Format max={max}>{value || children}</Format>
              </Container>
            )}
          </BadgeThemeConsumer>
        )}
      </AtlaskitThemeConsumer>
    );
  }
}
