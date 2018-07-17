// @flow

import React, { Component, type Node } from 'react';
import { Consumer, Provider } from '../components/Context';
import type {
  ThemeInput,
  ThemeInputFunction,
  ThemeOutput,
  ThemeOutputFunction,
  ThemeOutputValue,
} from '../types';

type Props = {
  children: ((*) => Node) | Node,
  values: ThemeInput,
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
      // eslint-disable-next-line no-param-reassign
      parentThemeCopy[name] = resolveThemeValue(parentTheme, childTheme, name);
      return parentThemeCopy;
    },
    { ...parentTheme },
  );
}

function simplifyThemeFunction(
  parentTheme: ThemeOutput,
  childTheme: ThemeInput,
  childThemeFn: ThemeInputFunction,
  name: string,
): ThemeOutputFunction {
  return state =>
    childThemeFn(state, {
      ...childTheme,
      [name]: parentTheme[name] || noop,
    });
}

export default class Theme extends Component<Props> {
  static defaultProps = {
    values: {},
  };
  render() {
    const { children, values: childTheme } = this.props;
    return (
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
  }
}
