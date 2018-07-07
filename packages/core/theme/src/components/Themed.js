// @flow

import React, { Component } from 'react';

import { Consumer } from './Context';
import type { ThemeStructure } from '../types';

type Props = {
  /** Render prop to render the descendant tree. */
  children: (*) => *,
  /** The component being themed. */
  component: { constructor: { displayName: string, defaultProps: * } },
  /** Props that are used in the component theming functions to dynamically change it. */
  props: { [string]: * },
};

function callIfFunction(fn, theme, props): {} | void {
  return typeof fn === 'function' ? fn(theme, props) : null;
}

export default class Themed extends Component<Props> {
  static displayName = 'Ak.Core.Theme';
  static defaultProps = {
    props: {},
  };
  render() {
    const { children, component, props } = this.props;
    const { defaultProps, displayName } = component.constructor;
    return (
      <Consumer>
        {(theme: ThemeStructure) => {
          const themeDefault = callIfFunction(defaultProps.theme, theme, props);
          const themeContext = callIfFunction(
            theme[displayName],
            themeDefault,
            props,
          );
          const themeOnProps =
            defaultProps.theme !== component.props.theme &&
            callIfFunction(
              component.props.theme,
              themeContext || themeDefault,
              props,
            );
          return children({
            ...themeDefault,
            ...themeContext,
            ...themeOnProps,
          });
        }}
      </Consumer>
    );
  }
}
