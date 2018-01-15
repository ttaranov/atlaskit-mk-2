// @flow
import PropTypes from 'prop-types';
import { type Node } from 'react';
import { mount, shallow } from 'enzyme';
import { itemThemeNamespace } from '@atlaskit/item';
import { prefix } from '../src/theme/util';
import * as presets from '../src/theme/presets';
import type { RootTheme, Provided } from '../src/theme/types';
import createItemTheme from '../src/theme/map-navigation-theme-to-item-theme';

export const withRootTheme = (
  provided: Provided,
  isCollapsed?: boolean = false,
): Object => {
  const rootTheme: RootTheme = {
    provided,
    isCollapsed,
  };
  return {
    [prefix('root')]: rootTheme,
    [itemThemeNamespace]: createItemTheme(provided),
  };
};

const defaultTheme: Object = withRootTheme(presets.container);

export const shallowWithTheme = (
  children: Node,
  theme?: Object = defaultTheme,
) =>
  shallow(children, {
    context: theme,
  });

// Taken from https://github.com/styled-components/styled-components/issues/624#issuecomment-289944633
// Ideally this would not be needed and we would use WithTheme,
// but some tests rely on wrapper.setProps and this can only be done on the root.
export const mountWithRootTheme = (
  children: Node,
  theme?: Object = defaultTheme,
  options: {} = {},
) => {
  const createBroadcast = initialValue => {
    let listeners = [];
    let currentValue = initialValue;

    return {
      publish(value: mixed) {
        currentValue = value;
        listeners.forEach(listener => listener(currentValue));
      },
      subscribe(listener) {
        listeners.push(listener);
        listener(currentValue);

        return () => {
          listeners = listeners.filter(item => item !== listener);
        };
      },
    };
  };
  const CHANNEL = '__styled-components__';
  const broadcast = createBroadcast(theme);

  const themeContextTypes = Object.keys(theme).reduce(
    (prev: Object, current: string): Object => ({
      ...prev,
      [current]: PropTypes.any,
    }),
    {},
  );

  return mount(children, {
    ...options,
    context: {
      [CHANNEL]: broadcast.subscribe,
      ...theme,
      ...(options.context || {}),
    },
    childContextTypes: {
      [CHANNEL]: broadcast.publish,
      ...themeContextTypes,
      ...(options.childContextTypes || {}),
    },
  });
};
