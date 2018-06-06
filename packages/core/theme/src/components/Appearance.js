// @flow

type ValidProps = {} | Function | string;
type Props = {
  children: Function,
  props: ValidProps,
  theme: {},
};

const emptyObject = {};

function resolveAppearance(props: ValidProps) {
  return typeof props === 'string' ? props : 'default';
}

function resolveProps(props: ValidProps, theme: {}): {} {
  if (typeof props === 'function') {
    return props(theme || emptyObject);
  } else if (typeof props === 'object') {
    return { ...props };
  }
  return {};
}

function mergePropsWithTheme(appearance: string, props: {}, theme: {}) {
  const merged = { ...props };
  Object.keys(theme).forEach(key => {
    if (!(key in props)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return merged;
}

export default ({ children, props, theme }: Props) => {
  const resolvedAppearance = resolveAppearance(props);
  const resolvedProps = resolveProps(props, theme);
  const merged = mergePropsWithTheme(resolvedAppearance, resolvedProps, theme);
  return children(merged);
};
