// @flow
import { css } from 'styled-components';

import hasOwnProperty from '../utils/has-own-property';
import type { Provided, ScrollBarTheme } from '../theme/types';
import { container, global, dark } from './presets';

export const prefix = (key: string): string =>
  `@atlaskit-private-theme-do-not-use/navigation:${key}`;
export const rootKey = prefix('root');
export const groupKey = prefix('group');
export const isDropdownOverflowKey = prefix('isDropdownOverflow');
export const isElectronMacKey = prefix('isElectronMac');
export const electronMacTopPadding = 14;

// flowlint-next-line unclear-type:off
export const isElectronMac = (map?: Object): boolean =>
  map !== undefined &&
  hasOwnProperty(map, isElectronMacKey) &&
  map[isElectronMacKey];

// flowlint-next-line unclear-type:off
export const getProvided = (map?: Object): Provided => {
  if (map !== undefined && hasOwnProperty(map, rootKey) && map[rootKey]) {
    return map[rootKey].provided;
  }
  return container;
};
// flowlint-next-line unclear-type:off
export const isCollapsed = (map: Object): boolean =>
  map[rootKey] && map[rootKey].isCollapsed;

// flowlint-next-line unclear-type:off
export const isInOverflowDropdown = (map: Object): boolean =>
  hasOwnProperty(map, isDropdownOverflowKey);

// flowlint-next-line unclear-type:off
export const isInCompactGroup = (map: Object): boolean => {
  if (!hasOwnProperty(map, groupKey)) {
    return false;
  }
  return map[groupKey].isCompact;
};

// flowlint-next-line unclear-type:off
export const whenCollapsed = (...args: Array<any>) => css`
  ${({ theme }) => (isCollapsed(theme) ? css(...args) : '')};
`;

// flowlint-next-line unclear-type:off
export const whenNotCollapsed = (...args: Array<any>) => css`
  ${({ theme }) => (!isCollapsed(theme) ? css(...args) : '')};
`;

// flowlint-next-line unclear-type:off
export const whenNotInOverflowDropdown = (...args: Array<any>) => css`
  ${({ theme }) => (!isInOverflowDropdown(theme) ? css(...args) : '')};
`;

export const whenCollapsedAndNotInOverflowDropdown = (
  // flowlint-next-line unclear-type:off
  ...args: Array<any>
) => css`
  ${({ theme }) =>
    isCollapsed(theme) && !isInOverflowDropdown(theme) ? css(...args) : ''};
`;

// flowlint-next-line unclear-type:off
export const getProvidedScrollbar = (map?: Object): ScrollBarTheme => {
  if (
    map !== undefined &&
    hasOwnProperty(map, rootKey) &&
    map[rootKey] &&
    map[rootKey].provided.scrollBar
  ) {
    return map[rootKey].provided.scrollBar;
  }
  return container.scrollBar;
};

// NOTE: Dark mode is a user preference that takes precedence over provided themes
export const defaultContainerTheme = (
  containerTheme?: Provided,
  mode?: string,
) => {
  if (containerTheme && containerTheme.hasDarkmode) {
    return containerTheme;
  }
  if (mode === 'dark') {
    return dark;
  }
  return containerTheme || container;
};
export const defaultGlobalTheme = (globalTheme?: Provided, mode?: string) => {
  if (globalTheme && globalTheme.hasDarkmode) return globalTheme;
  if (mode === 'dark') {
    return dark;
  }
  return globalTheme || global;
};

export { default as WithRootTheme } from './with-root-theme';
