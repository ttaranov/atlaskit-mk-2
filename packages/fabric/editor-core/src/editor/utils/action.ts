import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { stateKey as mediaStateKey, MediaPluginState } from '../../plugins/media';

export async function getEditorValueWithMedia(editorState?: EditorState): Promise<Node | undefined> {
  if (!editorState) {
    return;
  }

  const mediaPluginState = editorState &&
     mediaStateKey.getState(editorState) as MediaPluginState;

  if (mediaPluginState && mediaPluginState.waitForMediaUpload) {
    await mediaPluginState.waitForPendingTasks();
  }

  return editorState.doc;
}

export function insertFileFromDataUrl(editorState: EditorState | undefined, url: string, fileName: string): void {
  if (!editorState) {
    return;
  }

  const mediaPluginState = mediaStateKey.getState(editorState) as MediaPluginState;
  mediaPluginState.insertFileFromDataUrl(url, fileName);
}
