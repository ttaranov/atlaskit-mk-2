import {
  EditorState,
  Transaction,
  // NodeSelection,
  Selection,
} from 'prosemirror-state';
import { pluginKey } from './plugin';
import { Color as ColorType } from '@atlaskit/status';

export type StatusType = {
  color: ColorType;
  text: string;
  localId?: string;
};

export const DEFAULT_STATUS: StatusType = {
  text: 'Default',
  color: 'neutral',
};

export const insertStatus = (status?: StatusType) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { schema } = state;

  const statusProps = { ...DEFAULT_STATUS, ...status };

  const tr = state.tr;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    const statusNode = schema.nodes.status.createChecked(statusProps);
    dispatch(tr.replaceSelectionWith(statusNode).scrollIntoView());
    return true;
  }

  if (state.doc.nodeAt(showStatusPickerAt)) {
    dispatch(
      tr
        .setNodeMarkup(showStatusPickerAt, schema.nodes.status, statusProps)
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

export const closeStatusPicker = () => editorView => {
  const { state, dispatch } = editorView;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    return false;
  }

  dispatch(
    state.tr
      .setMeta(pluginKey, { showStatusPickerAt: null })
      .setSelection(
        Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)),
      ),
  );

  editorView.focus();
};
