import { MarkEncoder } from '..';

export const underline: MarkEncoder = (text: string): string => {
  return `+${text}+`;
};
