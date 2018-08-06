// @flow
import { css } from 'styled-components';
import { borderRadius, fontSize, gridSize, math } from '@atlaskit/theme';
import themeDefinitions from './themeDefinitions';
import { themeNamespace } from '../theme';

const getProvidedTheme = ({ theme }) => (theme && theme[themeNamespace]) || {};

const getAppearanceProperty = (
  property,
  appearance,
  providedTheme,
  inBuiltTheme,
) => {
  const providedAppearanceStyles = providedTheme[appearance];
  const inBuiltAppearanceStyles = inBuiltTheme[appearance];
  const defaultAppearanceStyles = inBuiltTheme.default;

  return (
    (providedAppearanceStyles && providedAppearanceStyles[property]) ||
    (inBuiltAppearanceStyles && inBuiltAppearanceStyles[property]) ||
    defaultAppearanceStyles[property]
  );
};

const getState = ({ disabled, isActive, isFocus, isHover, isSelected }) => {
  if (disabled) return 'disabled';
  if (isSelected && isFocus) return 'focusSelected';
  if (isSelected) return 'selected';
  if (isActive) return 'active';
  if (isHover) return 'hover';
  if (isFocus) return 'focus';
  return 'default';
};

export const getPropertyAppearance = (
  property: string,
  props: Object = {},
  definitions: Object = themeDefinitions,
) => {
  const { appearance } = props;
  const { fallbacks, theme: inBuiltTheme } = definitions;
  const providedTheme = getProvidedTheme(props);

  const propertyStyles = getAppearanceProperty(
    property,
    appearance,
    providedTheme,
    inBuiltTheme,
  );

  if (!propertyStyles) {
    return fallbacks[property] || 'initial';
  }

  const state = getState(props);

  return propertyStyles[state] || propertyStyles.default || fallbacks[property];
};

export default function getButtonStyles(props: Object) {
  // $FlowFixMe - should be fixed when theme work is done
  const baseSize = fontSize(props);
  const buttonHeight = `${math.divide(math.multiply(gridSize, 4), baseSize)(
    props,
  )}em`;
  const compactButtonHeight = `${math.divide(
    math.multiply(gridSize, 3),
    baseSize,
  )(props)}em`;

  /**
   * Variable styles
   */
  let cursor = 'default';
  let height = buttonHeight;
  let lineHeight = buttonHeight;
  let outline = 'none';
  // $FlowFixMe - should be fixed when theme work is done
  let padding = `0 ${gridSize(props)}px`;
  let transitionDuration = '0.1s, 0.15s';
  let transition =
    'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  let verticalAlign = 'middle';
  let width = 'auto';

  /**
   * Appearance + Theme styles
   */
  const background = getPropertyAppearance('background', props);
  const color = getPropertyAppearance('color', props);
  const boxShadowColor = getPropertyAppearance('boxShadowColor', props);
  const boxShadow = boxShadowColor
    ? css`
        box-shadow: 0 0 0 2px ${boxShadowColor};
      `
    : null;
  const textDecoration = getPropertyAppearance('textDecoration', props);

  // Spacing: Compact
  if (props.spacing === 'compact') {
    height = compactButtonHeight;
    lineHeight = compactButtonHeight;
  }

  // Spacing: None
  if (props.spacing === 'none') {
    height = 'auto';
    lineHeight = 'inherit';
    padding = '0';
    verticalAlign = 'baseline';
  }

  // Interaction: Hover
  if (props.isHover) {
    cursor = 'pointer';
    transition =
      'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)';
  }

  // Interaction: Active
  if (props.isActive) {
    transitionDuration = '0s';
  }

  // Interaction: Focus
  if (props.isFocus) {
    outline = 'none';
    transitionDuration = '0s, 0.2s';
  }

  // Disabled
  if (props.disabled) {
    cursor = 'not-allowed';
  }

  // Loading
  const isLoadingStyles = p => (p.isLoading ? 'pointer-events: none;' : null);

  // Fit to parent width
  if (props.fit) {
    width = '100%';
  }

  /* Note use of !important to override the ThemeReset on anchor tag styles */

  return css`
    align-items: baseline;
    background: ${background};
    border-radius: ${borderRadius}px;
    border-width: 0;
    box-sizing: border-box;
    color: ${color} !important;
    cursor: ${cursor};
    display: inline-flex;
    font-size: inherit;
    font-style: normal;
    height: ${height};
    line-height: ${lineHeight};
    margin: 0;
    max-width: 100%;
    outline: ${outline} !important;
    padding: ${padding};
    text-align: center;
    text-decoration: ${textDecoration};
    transition: ${transition};
    transition-duration: ${transitionDuration};
    vertical-align: ${verticalAlign};
    white-space: nowrap;
    width: ${width};
    ${boxShadow} &::-moz-focus-inner {
      border: 0;
      margin: 0;
      padding: 0;
    }
    ${isLoadingStyles};
  `;
}
