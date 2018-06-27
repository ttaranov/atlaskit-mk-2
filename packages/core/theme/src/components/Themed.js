// @flow

import React from 'react';
import type { Node } from 'react';

import { Consumer } from './Context';
import callOrPassAll from '../utils/callOrPassAll';
import type { ThemeStructure } from '../types';

type Props = {
  children: (*) => Node,
  component: string,
  defaults: *,
  props: *,
  overrides: *,
};

export default ({ children, component, defaults, props, overrides }: Props) => (
  <Consumer>
    {({ components, ...themeParent }: ThemeStructure) => {
      const executedDefaults = callOrPassAll(defaults, themeParent);
      const executedTheme = callOrPassAll(overrides, themeParent);
      const executedComponents = components
        ? callOrPassAll(components[component], props)
        : null;
      return children({
        ...executedDefaults,
        ...themeParent,
        ...executedComponents,
        ...executedTheme,
      });
    }}
  </Consumer>
);
