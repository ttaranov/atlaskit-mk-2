import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { pluginKey } from './plugin';
import { Color as ColorType } from '@atlaskit/status';

export type StatusType = {
  color: ColorType;
  text: string;
  localId?: string;
};

export const DEFAULT_STATUS: StatusType = {
  text: '',
  color: 'neutral',
};

export const insertStatus = (status?: StatusType) => (
  editorView: EditorView,
): boolean => {
  const { state, dispatch } = editorView;
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
        .setSelection(Selection.near(tr.doc.resolve(showStatusPickerAt + 1)))
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

export const commitStatusPicker = () => (editorView: EditorView) => {
  const { state, dispatch } = editorView;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    return;
  }

  const statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

  if (!statusNode) {
    return true;
  }

  let tr = state.tr;
  tr = tr.setMeta(pluginKey, { showStatusPickerAt: null });

  if (statusNode.attrs.text) {
    // still has content - keep content
    tr = tr.setSelection(
      Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)),
    );
  } else {
    // no content - remove node
    tr = tr
      .delete(showStatusPickerAt, showStatusPickerAt + 1)
      .setSelection(Selection.near(state.tr.doc.resolve(showStatusPickerAt)));
  }

  dispatch(tr);
  editorView.focus();
};
