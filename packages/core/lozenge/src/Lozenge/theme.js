// @flow
import { colors, themed } from '@atlaskit/theme';
/* Note:
 Lozenge does not support dark mode at the moment,
 it will be implemented later.
 Hence, color values are the same.
 */
export const backgroundColor = themed('appearance', {
  default: { light: colors.N20, dark: colors.N20 },
  inprogress: { light: colors.B50, dark: colors.B50 },
  moved: { light: colors.Y50, dark: colors.Y50 },
  new: { light: colors.P50, dark: colors.P50 },
  removed: { light: colors.R50, dark: colors.R50 },
  success: { light: colors.G50, dark: colors.G50 },
});

export const textColor = themed('appearance', {
  default: { light: colors.N500, dark: colors.N500 },
  inprogress: { light: colors.B500, dark: colors.B500 },
  moved: { light: colors.N600, dark: colors.N600 },
  new: { light: colors.P500, dark: colors.P500 },
  removed: { light: colors.R500, dark: colors.R500 },
  success: { light: colors.G500, dark: colors.G500 },
});

export const boldBackgroundColor = themed('appearance', {
  default: { light: colors.N40, dark: colors.N40 },
  inprogress: { light: colors.B500, dark: colors.B500 },
  moved: { light: colors.Y500, dark: colors.Y500 },
  new: { light: colors.P500, dark: colors.P500 },
  removed: { light: colors.R500, dark: colors.R500 },
  success: { light: colors.G500, dark: colors.G500 },
});

export const boldTextColor = themed('appearance', {
  default: { light: colors.N700, dark: colors.N700 },
  inprogress: { light: colors.N0, dark: colors.N0 },
  moved: { light: colors.N600, dark: colors.N600 },
  new: { light: colors.N0, dark: colors.N0 },
  removed: { light: colors.N0, dark: colors.N0 },
  success: { light: colors.N0, dark: colors.N0 },
});

export const defaultStyles = { backgroundColor, textColor };
export const boldStyles = {
  backgroundColor: boldBackgroundColor,
  textColor: boldTextColor,
};
