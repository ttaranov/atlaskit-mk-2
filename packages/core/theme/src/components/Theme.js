// @flow

import React from 'react';
import type { Node } from 'react';
import type { ThemeStructure } from '../types';
import { Consumer, Provider } from './Context';
import callOrPassAll from '../utils/callOrPassAll';

type Props = ThemeStructure & { children: Node };

const emptyObj = {};

export const Theme = ({ children, components, mode, ...props }: Props) => (
  <Consumer>
    {(theme: ThemeStructure) => {
      // Pre-calc dynamic values based on the parent theme so this doesn't have
      // to be done in the Themed helper.
      const executedProps = callOrPassAll(props, theme);
      return (
        <Provider
          value={{
            ...theme,
            components: { ...theme.components, ...components },
            ...executedProps,
          }}
        >
          {children}
        </Provider>
      );
    }}
  </Consumer>
);
