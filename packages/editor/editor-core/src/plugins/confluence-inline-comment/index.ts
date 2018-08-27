import { EditorPlugin } from '../../types';
import { confluenceInlineComment } from '@atlaskit/editor-common';

// tslint:disable-next-line:variable-name
const confluenceInlineCommentPlugin: EditorPlugin = {
  marks() {
    return [
      {
        name: 'confluenceInlineComment',
        mark: confluenceInlineComment,
      },
    ];
  },
};

export default confluenceInlineCommentPlugin;
