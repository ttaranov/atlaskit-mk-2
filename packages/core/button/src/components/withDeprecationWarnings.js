// @flow

import React, {
  Component,
  type ComponentType,
  type ElementConfig,
} from 'react';
import type { ButtonAppearances } from '../types';

const getComponentName = (target: any): string => {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
};

const warnIfDeprecatedAppearance = appearance => {
  const deprecatedAppearances = ['help'];
  if (appearance && deprecatedAppearances.includes(appearance)) {
    // eslint-disable-next-line no-console
    console.warn(
      `Atlaskit: The Button appearance "${appearance}" is deprecated. Please use styled-components' ThemeProvider to provide a custom theme for Button instead.`,
    );
  }
};

export default function withDeprecationWarnings<
  Props: { appearance?: ButtonAppearances },
  InnerComponent: ComponentType<Props>,
>(
  WrappedComponent: InnerComponent,
): ComponentType<ElementConfig<InnerComponent>> {
  return class WithDeprecationWarnings extends Component<$ReadOnly<Props>> {
    static displayName = `WithDeprecationWarnings(${getComponentName(
      WrappedComponent,
    )})`;

    componentWillMount() {
      warnIfDeprecatedAppearance(this.props.appearance);
    }

    componentWillReceiveProps(newProps: *) {
      if (newProps.appearance !== this.props.appearance) {
        warnIfDeprecatedAppearance(newProps.appearance);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
