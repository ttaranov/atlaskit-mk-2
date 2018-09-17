// @flow

export type ThemeIn = {
  mode: 'dark' | 'light',
};

export type ThemeOut = {
  backgroundColor: 'string',
  mode: 'light' | 'dark',
};

export default (props: ThemeIn): ThemeOut => {
  return {
    backgroundColor: null,

    // We theoretically shouldn't need to pass the mode down, transforming
    // the values here and then passing *those* down. However, the copmlexity
    // involved in the styled-components style functions would need to be
    // refactored first.
    mode: props.mode || 'light',
  };
};
