import { EditorPlugin } from '../../types';
import createPlugin from '../../../plugins/fake-text-cursor';

const fakeTextCursor: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 2100, plugin: createPlugin }];
  },
};

export default fakeTextCursor;
