// @flow

type Props = {
  children?: number,
  limit?: number,
};

export const Max = ({ children = 0, limit }: Props): string => {
  let formatted = '';
  if (children === Infinity) {
    formatted = '∞';
  } else if (limit != null && children > limit) {
    formatted = `${limit}+`;
  } else {
    formatted = `${children}`;
  }
  return formatted;
};
