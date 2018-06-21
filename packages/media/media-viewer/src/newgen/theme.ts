import { themed, colors } from '@atlaskit/theme';

const buttonTheme = {
  toolbar: {
    background: {
      hover: themed({ light: colors.DN60 }),
      active: themed({ light: colors.B75 }),
    },
    boxShadowColor: {
      focus: themed({ light: colors.B75 }),
    },
    color: {
      default: themed({ light: colors.DN400 }),
      hover: themed({ light: colors.DN400 }),
      active: themed({ light: colors.B400 }),
      disabled: themed({ light: colors.DN100 }),
    },
  },
};

export const theme = { '@atlaskit-shared-theme/button': buttonTheme };
