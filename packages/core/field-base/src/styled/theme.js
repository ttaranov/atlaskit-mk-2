// @flow
import { colors, themed } from '@atlaskit/theme';

// The following are the name for color mappings in @atlaskit/themes
// The exports are the functions, not the objects, so could not be used here
const codeBlock = { light: colors.N20, dark: colors.DN80 };
const hover = { light: colors.N20, dark: colors.DN30 };
const disabled = { light: colors.N20, dark: colors.DN20 };
// For validation red is the new 'yellow' which was { light: colors.Y300, dark: colors.Y300 }
const red = { light: colors.R400, dark: colors.R400 };
// linkOutline has been altered based on the colors in the text-field spec
const linkOutline = { light: colors.B100, dark: colors.B75 };
// The following do not yet have a darkmode 'map': N20A, N10

export const getBackgroundColor = themed('appearance', {
  standard: { light: colors.N10, dark: colors.DN10 },
  disabled,
  invalid: { light: colors.N10, dark: colors.DN10 },
  subtle: { light: 'transparent', dark: 'transparent' },
  none: { light: 'transparent', dark: 'transparent' },
});

export const getBackgroundColorFocus = themed('appearance', {
  standard: { light: colors.N0, dark: colors.DN10 },
  disabled,
  invalid: { light: colors.N0, dark: colors.DN10 },
  subtle: { light: colors.N0, dark: colors.DN10 },
  none: { light: 'transparent', dark: 'transparent' },
});

export const getBackgroundColorHover = themed('appearance', {
  standard: hover,
  disabled,
  invalid: hover,
  subtle: hover,
  none: { light: 'transparent', dark: 'transparent' },
});

export const getBorderColor = themed('appearance', {
  standard: codeBlock,
  disabled: { light: colors.N20A, dark: colors.DN20A },
  invalid: red,
  subtle: { light: 'transparent', dark: 'transparent' },
  none: { light: 'transparent', dark: 'transparent' },
});

export const getBorderColorFocus = themed('appearance', {
  standard: linkOutline,
  disabled: { light: colors.N20A, dark: colors.DN20A },
  invalid: linkOutline,
  subtle: linkOutline,
  none: { light: 'transparent', dark: 'transparent' },
});

export const getBorderColorHover = themed('appearance', {
  standard: codeBlock,
  disabled: { light: colors.N20A, dark: colors.DN20A },
  invalid: red,
  subtle: codeBlock,
  none: { light: 'transparent', dark: 'transparent' },
});
