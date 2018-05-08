// @flow

import { colors } from '@atlaskit/theme';

import { light } from '../theme/modes';
import type { Mode } from './types';

type Args = {
  background: string,
  text: string,
};

export default ({ background, text }: Args): Mode => {
  return {
    globalNav: () => {
      const styles = light.globalNav();
      return {
        ...styles,
        backgroundColor: background,
        color: text,
      };
    },
    scrollHint: () => {
      const { root } = light.scrollHint();
      const rootStyles = {
        ...root,
        wrapper: {
          ...root.wrapper,
          '&::before': {
            ...root.wrapper['&::before'],
            backgroundColor: colors.N80A,
          },
        },
        inner: {
          ...root.inner,
          '&::before': {
            ...root.inner['&::before'],
            backgroundColor: background,
          },
        },
      };
      return { container: rootStyles, root: rootStyles };
    },
  };
};
