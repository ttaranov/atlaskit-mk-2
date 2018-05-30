// @flow

type Props = {
  /** The number to format. */
  children?: number,

  /** The maximum value to display. If value is 100, and max is 50, "50+" will be displayed */
  max?: number,
};

const Format = ({ children = 0, max = 0 }: Props): string => {
  let formatted = '';

  if (children < 0) {
    children = 0;
  }

  if (max < 0) {
    max = 0;
  }

  if (max && max < children) {
    formatted = `${max}+`;
  } else if (children === Infinity) {
    formatted = '∞';
  } else {
    formatted = children;
  }

  return `${formatted}`;
};
Format.displayName = 'Ak.Badge.Format';

export default Format;
