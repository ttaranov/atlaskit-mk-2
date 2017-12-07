import { EditorPlugin } from '../../types';
import createPlugin from '../../../plugins/placeholder-cursor';

const placeholderCursor: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 2100, plugin: createPlugin }];
  },
};

export default placeholderCursor;
