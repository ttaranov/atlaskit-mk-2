import { DocNode, TopLevel } from '@atlaskit/editor-common';

export const doc = (...content: TopLevel): DocNode => ({
  type: 'doc',
  version: 1,
  content,
});
