import { LinkAttributes } from '@atlaskit/editor-common';
import { MarkEncoder } from '..';

export const link: MarkEncoder = (
  text: string,
  attrs: LinkAttributes,
): string => {
  return `[${text}|${attrs.href}]`;
};
