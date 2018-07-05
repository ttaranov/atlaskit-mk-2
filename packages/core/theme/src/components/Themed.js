// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import { Consumer } from './Context';
import callOrPass from '../utils/callOrPass';
import callOrPassAll from '../utils/callOrPassAll';
import type { ThemeStructure } from '../types';

type Props = {
  children: (*) => Node,
  component?: string,
  defaults: *,
  props: *,
  overrides: *,
};

export default class extends Component<Props> {
  static displayName = 'Ak.Core.Theme';
  static defaultProps = {
    defaults: {},
    overrides: {},
    props: {},
  };
  render() {
    const { children, component, defaults, props, overrides } = this.props;
    return (
      <Consumer>
        {({ components, ...themeParent }: ThemeStructure) => {
          const executedDefaults = callOrPassAll(defaults, themeParent);
          const executedTheme = callOrPassAll(overrides, themeParent);
          const executedComponent =
            component && components && components[component]
              ? callOrPass(components[component], props)
              : null;
          return children({
            ...executedDefaults,
            ...themeParent,
            ...executedComponent,
            ...executedTheme,
          });
        }}
      </Consumer>
    );
  }
}
