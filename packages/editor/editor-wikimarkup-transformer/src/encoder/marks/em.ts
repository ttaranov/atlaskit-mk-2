import { MarkEncoder } from '..';

export const em: MarkEncoder = (text: string): string => {
  if (text.startsWith('-- ')) {
    // This is a citation
    return `??${text.substring(3)}??`;
  }
  return `_${text}_`;
};
