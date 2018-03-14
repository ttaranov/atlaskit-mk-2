import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

import {
  stateKey as mediaStateKey,
  MediaPluginState,
} from '../plugins/media/pm-plugins/main';

export async function getEditorValueWithMedia(
  editorView?: EditorView,
): Promise<Node | undefined> {
  if (!editorView) {
    return;
  }

  const { state } = editorView;

  const mediaPluginState =
    state && (mediaStateKey.getState(state) as MediaPluginState);

  if (mediaPluginState && mediaPluginState.waitForMediaUpload) {
    await mediaPluginState.waitForPendingTasks();
  }

  return editorView.state.doc;
}

export function insertFileFromDataUrl(
  editorState: EditorState | undefined,
  url: string,
  fileName: string,
): void {
  if (!editorState) {
    return;
  }

  const mediaPluginState = mediaStateKey.getState(
    editorState,
  ) as MediaPluginState;
  mediaPluginState.insertFileFromDataUrl(url, fileName);
}
