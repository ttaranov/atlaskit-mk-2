// @flow
import { colors } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';

export const baseAppearanceObj = {
  info: {
    backgroundColor: colors.B50,
    Icon: InfoIcon,
    primaryIconColor: colors.B500,
  },
  warning: {
    backgroundColor: colors.Y50,
    Icon: WarningIcon,
    primaryIconColor: colors.Y500,
  },
  error: {
    backgroundColor: colors.R50,
    Icon: ErrorIcon,
    primaryIconColor: colors.R500,
  },
  confirmation: {
    backgroundColor: colors.G50,
    Icon: CheckCircleIcon,
    primaryIconColor: colors.G500,
  },
  change: {
    backgroundColor: colors.P50,
    Icon: InfoIcon,
    primaryIconColor: colors.P500,
  },
};
