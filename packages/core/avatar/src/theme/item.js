// @flow

export type ThemeItemIn = {
  mode?: 'dark' | 'light',
};

export type ThemeItemOut = {
  backgroundColor: 'string',
  mode: 'light' | 'dark',
};

export function themeItem(parent: ThemeItemIn): ThemeItemOut {
  return {
    backgroundColor: null,

    // We theoretically shouldn't need to pass the mode down, transforming
    // the values here and then passing *those* down. However, the copmlexity
    // involved in the styled-components style functions would need to be
    // refactored first.
    mode: parent.mode || 'light',
  };
}
