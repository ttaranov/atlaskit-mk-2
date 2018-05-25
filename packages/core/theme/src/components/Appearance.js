//@flow
type Props = {
  children: Function,
  props: {} | string,
  state: {},
  theme: {},
};

const emptyObject = {};
export default ({ children, props, state, theme }: Props) => {
  // eslint-disable-next-line
  const appearance =
    typeof props === 'object'
      ? 'default'
      : typeof props === 'function'
        ? props(state || emptyObject)
        : props;
  const merged = typeof props === 'object' ? { ...props } : {};
  Object.keys(theme).forEach(key => {
    if (!(key in merged)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return children(merged);
};
