// @flow
import React, { Component } from 'react';
import { getDisplayName } from '../utils';
import type { ComponentType, ElementType, FunctionType } from '../types';

export default function mapProps(mapping: {}) {
  return (DecoratedComponent: ComponentType) =>
    // TODO: type this correctly
    class MapProps extends Component<*> {
      static displayName: string | void | null = getDisplayName(
        'mapProps',
        DecoratedComponent,
      );
      static DecoratedComponent: ComponentType = DecoratedComponent;

      component: { blur?: FunctionType, focus?: FunctionType };

      // expose blur/focus to consumers via ref
      blur = () => {
        if (this.component.blur) this.component.blur();
      };
      focus = () => {
        if (this.component.focus) this.component.focus();
      };

      setComponent = (component: ElementType) => {
        this.component = component;
      };

      render() {
        const mapped: {} = {
          ...this.props,
          ...Object.keys(mapping).reduce(
            (acc, key) => ({
              ...acc,
              [key]: mapping[key](this.props),
            }),
            {},
          ),
        };

        return <DecoratedComponent ref={this.setComponent} {...mapped} />;
      }
    };
}
