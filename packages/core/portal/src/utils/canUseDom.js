// @flow

const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

export default canUseDOM;
