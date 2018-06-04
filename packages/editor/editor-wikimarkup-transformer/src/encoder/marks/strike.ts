import { MarkEncoder } from '..';

export const strike: MarkEncoder = (text: string): string => {
  return `-${text}-`;
};
