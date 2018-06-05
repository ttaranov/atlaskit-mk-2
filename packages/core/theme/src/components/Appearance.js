//@flow
type Props = {
  children: Function,
  props: {} | string,
  state?: {},
  theme: {},
};

const emptyObject = {};

export default ({ children, props, state, theme }: Props) => {
  let appearance = typeof props === 'object' ? 'default' : props;
  let merged = typeof props === 'object' ? { ...props } : {};
  if (typeof props === 'function') {
    appearance = props(state || emptyObject);
    merged = appearance;
  }
  Object.keys(theme).forEach(key => {
    if (!(key in merged)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return children(merged);
};
