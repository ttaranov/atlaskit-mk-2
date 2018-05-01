// @flow

type ContextKey = string;

type Instance = {
  context: {
    [string]: {},
  },
};

// There are cases where the context is not available, such as when a dropdown item is used
// inside @atlaskit/navigation. For this reason we have this helper function which safely calls
// the context functions if they are available.
export default (instance: Instance, contextKey: ContextKey) => (
  fnToCall: string,
  // flowlint-next-line unclear-type:off
  ...args: Array<any>
): // flowlint-next-line unclear-type:off
any => {
  if (!instance.context[contextKey]) {
    return null;
  }

  return instance.context[contextKey][fnToCall](...args);
};
