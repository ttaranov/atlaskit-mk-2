// @flow

import React, { type Node } from 'react';
import { Consumer, Provider } from '../components/Context';
import type { ThemeStructure } from '../types';

type Props = {
  children: ((*) => Node) | Node,
} & ThemeStructure;

const noop = () => null;

function functionOrValue(parentTheme, childTheme, name) {
  return typeof childTheme[name] === 'function'
    ? simplifyThemeFunction(parentTheme, childTheme, name)
    : childTheme[name];
}

function mergeParentAndChildTheme(parentTheme, childTheme) {
  return Object.keys(childTheme).reduce(
    (parentThemeCopy, name) => {
      parentThemeCopy[name] = functionOrValue(parentTheme, childTheme, name);
      return parentThemeCopy;
    },
    { ...parentTheme },
  );
}

function simplifyThemeFunction(parentTheme, childTheme, name) {
  return state =>
    childTheme[name](state, {
      ...childTheme,
      [name]: parentTheme[name] || noop,
    });
}

export default ({ children, ...childTheme }: Props) => (
  <Consumer>
    {(parentTheme: ThemeStructure) => {
      const merged = mergeParentAndChildTheme(parentTheme, childTheme);
      return typeof children === 'function' ? (
        children(merged)
      ) : (
        <Provider value={merged}>{children}</Provider>
      );
    }}
  </Consumer>
);
