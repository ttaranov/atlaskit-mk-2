import { MarkEncoder } from '..';

export const subsup: MarkEncoder = (
  text: string,
  attrs: { type: 'sub' | 'sup' },
): string => {
  if (attrs.type === 'sub') {
    return `~${text}~`;
  } else {
    return `^${text}^`;
  }
};
