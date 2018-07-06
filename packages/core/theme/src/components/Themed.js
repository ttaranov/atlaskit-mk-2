// @flow

import React, { Component } from 'react';

import { Consumer } from './Context';
import type { ThemeStructure } from '../types';

type Props = {
  /** Render prop to render the descendant tree. */
  children: (*) => *,
  /** The instance of the component being themed. */
  component: Component,
  /** Props that are used in the component theming functions to dynamically change it. */
  props: { [string]: * },
};

function callIfFunction(fn, props): {} | void {
  return typeof fn === 'function' ? fn(props) : null;
}

export default class Themed extends Component<Props> {
  static displayName = 'Ak.Core.Theme';
  static defaultProps = {
    component: null,
    props: {},
  };
  render() {
    const { children, component, props } = this.props;
    return (
      <Consumer>
        {({ components, ...themeParent }: ThemeStructure) => {
          const { defaultProps, displayName } = component.constructor;
          return children({
            ...callIfFunction(defaultProps.theme, props),
            ...callIfFunction(themeParent[displayName], props),
            ...callIfFunction(component.props.theme, props),
          });
        }}
      </Consumer>
    );
  }
}
