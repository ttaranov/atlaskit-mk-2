import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../analytics';
import { EditorPlugin } from '../../types';

export function createPlugin(
  onSave?: (editorView: EditorView) => void,
): Plugin | undefined {
  if (!onSave) {
    return;
  }

  return keymap({
    Enter(state: EditorState, dispatch: (tr) => void, editorView: EditorView) {
      if (canSaveOnEnter(editorView)) {
        analyticsService.trackEvent('atlassian.editor.stop.submit');
        onSave(editorView);
        return true;
      }
      return false;
    },
  });
}

function canSaveOnEnter(editorView: EditorView) {
  const { $cursor } = editorView.state.selection as TextSelection;
  const { decisionItem, paragraph, taskItem } = editorView.state.schema.nodes;
  return (
    !$cursor ||
    ($cursor.parent.type === paragraph && $cursor.depth === 1) ||
    ($cursor.parent.type === decisionItem && !isEmptyAtCursor($cursor)) ||
    ($cursor.parent.type === taskItem && !isEmptyAtCursor($cursor))
  );
}

function isEmptyAtCursor($cursor) {
  const { content } = $cursor.parent;
  return !(content && content.size);
}

const saveOnEnterPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'saveOnEnter',
        plugin: ({ props }) => createPlugin(props.onSave),
      },
    ];
  },
};

export default saveOnEnterPlugin;
