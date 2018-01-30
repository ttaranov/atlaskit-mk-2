// @flow
import type { ComponentType } from './types';

export function omit(obj: {}, ...keysToOmit: Array<string>) {
  return Object.keys(obj).reduce((acc, key: string) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
}

// $FlowFixMe - ComponentType is not correct
export function getDisplayName(prefix: string, Component: ComponentType) {
  const componentName: string = Component.displayName || Component.name;

  return componentName ? `${prefix}(${componentName})` : prefix;
}

export function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message); // eslint-disable-line no-console
  }
}
