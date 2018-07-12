import { HardBreakDefinition } from '@atlaskit/editor-common';

export const hardBreak = (
  attrs?: HardBreakDefinition['attrs'],
): HardBreakDefinition => ({
  type: 'hardBreak',
  attrs,
});
