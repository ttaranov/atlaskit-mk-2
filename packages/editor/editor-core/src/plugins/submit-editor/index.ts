import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../analytics';
import { EditorPlugin } from '../../types';
import * as keymaps from '../../keymaps';
import { stateKey as mediaPluginKey } from '../../plugins/media/pm-plugins/main';
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
    [`${keymaps.submit.common}`]: (
      state: EditorState,
      dispatch: (tr) => void,
      editorView: EditorView,
    ) => {
      const mediaState = mediaPluginKey.getState(state);

      if (
        mediaState &&
        mediaState.waitForMediaUpload &&
        !mediaState.allUploadsFinished
      ) {
        return true;
      }

      eventDispatch(analyticsEventKey, analyticsPayload(state));
      analyticsService.trackEvent('atlassian.editor.stop.submit');
      onSave(editorView);
      return true;
    },
  });
}

const analyticsPayload = (state: EditorState) => ({
  action: 'stopped',
  actionSubjectId: 'save',
  attributes: {
    inputMethod: 'shortcut',
    documentSize: state.doc.nodeSize,
    // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks
  },
});

const submitEditorPlugin: EditorPlugin = {
  pmPlugins() {
    return [
      {
        name: 'submitEditor',
        plugin: ({ props, dispatch }) => createPlugin(dispatch, props.onSave),
      },
    ];
  },
};

export default submitEditorPlugin;
