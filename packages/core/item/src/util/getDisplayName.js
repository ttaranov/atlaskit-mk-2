// @flow
// from https://facebook.github.io/react/docs/higher-order-components.html

// flowlint-next-line unclear-type:off
const getDisplayName = (WrappedComponent: any) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default getDisplayName;
