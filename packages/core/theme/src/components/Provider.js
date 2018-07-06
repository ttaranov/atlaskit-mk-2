// @flow

import React from 'react';
import type { Node } from 'react';
import type { ThemeStructure } from '../types';
import { Consumer, Provider } from './Context';

type Props = ThemeStructure & { children: Node };

export default ({ children, components, ...props }: Props) => (
  <Consumer>
    {(theme: ThemeStructure) => {
      return (
        <Provider
          value={{
            ...theme,
            ...props,
          }}
        >
          {children}
        </Provider>
      );
    }}
  </Consumer>
);
