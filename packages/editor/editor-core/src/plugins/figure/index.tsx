import { caption } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';

const figurePlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'caption', node: caption }];
  },
};

export default figurePlugin;
