import { DocNode, BlockContent } from '@atlaskit/editor-common';

export const doc = (...content: Array<BlockContent>): DocNode => ({
  type: 'doc',
  version: 1,
  content,
});
