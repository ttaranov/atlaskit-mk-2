// @flow

import React, { type Node } from 'react';
import { Consumer, Provider } from '../components/Context';
import type { ThemeStructure } from '../types';

type Props = {
  children: ((*) => Node) | Node,
} & ThemeStructure;

const noop = () => null;

function simplifyThemeFunction(parentTheme, fn, name) {
  return state =>
    fn(state, { ...parentTheme, [name]: parentTheme[name] || noop });
}

function valueOrFunction(parentTheme, fn, name) {
  return typeof fn === 'function'
    ? simplifyThemeFunction(parentTheme, fn, name)
    : fn;
}

export default ({ children, ...props }: Props) => (
  <Consumer>
    {(theme: ThemeStructure) => {
      const merged = { ...theme };

      Object.keys(props).forEach(name => {
        merged[name] = valueOrFunction(theme, props[name], name);
      });

      return typeof children === 'function' ? (
        children(merged)
      ) : (
        <Provider value={merged}>{children}</Provider>
      );
    }}
  </Consumer>
);
