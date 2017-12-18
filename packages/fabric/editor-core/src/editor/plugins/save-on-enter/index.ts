import { analyticsService } from '../../../analytics';
import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EditorPlugin } from '../../types';

export function createPlugin(
  onSave?: (editorView: EditorView) => void,
): Plugin | undefined {
  if (!onSave) {
    return;
  }

  return keymap({
    Enter(state: EditorState, dispatch: (tr) => void, editorView: EditorView) {
      analyticsService.trackEvent('atlassian.editor.stop.submit');
      onSave(editorView);
      return true;
    },
  });
}

const saveOnEnterPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ rank: 300, plugin: ({ props }) => createPlugin(props.onSave) }];
  },
};

export default saveOnEnterPlugin;
