import { MarkEncoder } from '..';

export const strong: MarkEncoder = (text: string): string => {
  return `*${text}*`;
};
