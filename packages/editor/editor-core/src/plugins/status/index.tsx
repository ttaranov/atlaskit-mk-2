import { status } from '@atlaskit/editor-common';

import { EditorPlugin } from '../../types';
import createStatusPlugin from './plugin';

const statusPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'status', node: status }];
  },

  pmPlugins() {
    return [
      {
        name: 'status',
        plugin: createStatusPlugin,
      },
    ];
  },
};

export default statusPlugin;
