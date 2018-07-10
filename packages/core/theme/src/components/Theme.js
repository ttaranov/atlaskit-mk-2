// @flow

import React, { type Node } from 'react';
import { Consumer, Provider } from '../components/Context';
import type {
  ThemeInput,
  ThemeInputValue,
  ThemeOutput,
  ThemeOutputValue,
} from '../types';

type Props = {
  children: ((*) => Node) | Node,
  [string]: ThemeInputValue,
};

const noop = () => null;

function resolveThemeValue(
  parentTheme: ThemeOutput,
  childTheme: ThemeInput,
  name: string,
): ThemeOutputValue {
  const childThemeFn = childTheme[name];
  return typeof childThemeFn === 'function'
    ? simplifyThemeFunction(parentTheme, childTheme, childThemeFn, name)
    : childThemeFn;
}

function mergeParentAndChildTheme(
  parentTheme: ThemeOutput,
  childTheme: ThemeInput,
): ThemeOutput {
  return Object.keys(childTheme).reduce(
    (parentThemeCopy: ThemeOutput, name: string): ThemeOutput => {
      parentThemeCopy[name] = resolveThemeValue(parentTheme, childTheme, name);
      return parentThemeCopy;
    },
    { ...parentTheme },
  );
}

function simplifyThemeFunction(
  parentTheme: ThemeOutput,
  childTheme: ThemeInput,
  childThemeFn: *,
  name: string,
): (*) => ThemeOutput {
  return state => {
    return childThemeFn(state, {
      ...childTheme,
      [name]: parentTheme[name] || noop,
    });
  };
}

export default ({ children, ...childTheme }: Props) => (
  <Consumer>
    {(parentTheme: ThemeOutput) => {
      const merged = mergeParentAndChildTheme(parentTheme, childTheme);
      return typeof children === 'function' ? (
        children(merged)
      ) : (
        <Provider value={merged}>{children}</Provider>
      );
    }}
  </Consumer>
);
