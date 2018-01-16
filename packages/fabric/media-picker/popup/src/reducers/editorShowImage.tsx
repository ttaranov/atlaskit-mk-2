import { State } from '../domain';

import { EDITOR_SHOW_IMAGE } from '../actions/editorShowImage';

export default function editorShowImage(state: State, action: any): State {
  if (action.type === EDITOR_SHOW_IMAGE) {
    const { editorData } = state;
    const { imageUrl } = action;
    const originalFile =
      action.originalFile || (editorData && editorData.originalFile);

    return {
      ...state,
      editorData: {
        imageUrl,
        originalFile,
      },
    };
  }

  return state;
}
