// @flow

type ValidProps = {} | Function | string;
type Props = {
  children: Function,
  props: ValidProps,
  theme: {},
};

function resolveAppearance(props: ValidProps) {
  return typeof props === 'string' ? props : 'default';
}

function resolveProps(props: ValidProps): {} {
  if (typeof props === 'function') {
    return props();
  } else if (typeof props === 'object') {
    return { ...props };
  }
  return {};
}

function mergePropsWithTheme(appearance: string, props: {}, theme: {}) {
  let merged = { ...props };
  Object.keys(theme).forEach(key => {
    if (!(key in props)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return merged;
}

export default ({ children, props, theme }: Props) => {
  const resolvedAppearance = resolveAppearance(props);
  const resolvedProps = resolveProps(props);
  const merged = mergePropsWithTheme(resolvedAppearance, resolvedProps, theme);
  return children(merged);
};
