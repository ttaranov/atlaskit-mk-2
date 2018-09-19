import {
  EditorState,
  Transaction,
  // NodeSelection,
  Selection,
} from 'prosemirror-state';
import { pluginKey } from './plugin';
import { StatusType } from './index';

export const insertStatus = (status?: StatusType) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { schema } = state;
  let color;
  let text;
  let localId;
  if (status) {
    color = status.color;
    text = status.text;
    localId = status.localId;
  } else {
    color = 'neutral';
    text = 'Default';
  }

  const tr = state.tr;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    const statusNode = schema.nodes.status.createChecked({
      text,
      color,
      localId,
    });
    dispatch(tr.replaceSelectionWith(statusNode).scrollIntoView());
    return true;
  }

  if (state.doc.nodeAt(showStatusPickerAt)) {
    dispatch(
      tr
        .setNodeMarkup(showStatusPickerAt, schema.nodes.status, {
          color,
          text,
          localId,
        })
        .setSelection(Selection.near(tr.doc.resolve(showStatusPickerAt + 2)))
        .setMeta(pluginKey, { showStatusPickerAt: showStatusPickerAt })
        .scrollIntoView(),
    );
    return true;
  }

  return false;
};

export const setStatusPickerAt = (showStatusPickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { showStatusPickerAt }));
  return true;
};
