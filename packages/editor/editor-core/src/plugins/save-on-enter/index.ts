import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../analytics';
import { EditorPlugin } from '../../types';
import { analyticsEventKey } from '../../analytics';
import { Dispatch } from '../../event-dispatcher';

export function createPlugin(
  eventDispatch: Dispatch,
  onSave?: (editorView: EditorView) => void,
): Plugin | undefined {
  if (!onSave) {
    return;
  }

  return keymap({
    Enter(state: EditorState, dispatch: (tr) => void, editorView: EditorView) {
      if (canSaveOnEnter(editorView)) {
        eventDispatch(analyticsEventKey, analyticsPayload(state));
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
        plugin: ({ props, dispatch }) => createPlugin(dispatch, props.onSave),
      },
    ];
  },
};

const analyticsPayload = (state: EditorState) => ({
  action: 'stopped',
  actionSubject: 'editor',
  actionSubjectId: 'save',
  attributes: {
    inputMethod: 'shortcut',
    documentSize: state.doc.nodeSize,
    // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks
  },
});

export default saveOnEnterPlugin;
