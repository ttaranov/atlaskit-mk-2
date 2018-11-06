import {
  EditorState,
  NodeSelection,
  Transaction,
  Selection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { uuid } from '@atlaskit/editor-common';
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

export const createStatus = (showStatusPickerAtOffset: number) => (
  insert: (node?: Node | Object | string) => Transaction,
  state: EditorState,
): Transaction => {
  const statusNode = state.schema.nodes.status.createChecked({
    ...DEFAULT_STATUS,
    localId: uuid.generate(),
  });

  const tr = insert(statusNode);
  const showStatusPickerAt = tr.selection.from + showStatusPickerAtOffset;
  return tr
    .setSelection(NodeSelection.create(tr.doc, showStatusPickerAt))
    .setMeta(pluginKey, { showStatusPickerAt, autoFocus: true });
};

export const updateStatus = (status?: StatusType) => (
  editorView: EditorView,
): boolean => {
  const { state, dispatch } = editorView;
  const { schema } = state;

  const statusProps = { ...DEFAULT_STATUS, ...status };

  let tr = state.tr;
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
        .setMeta(pluginKey, { showStatusPickerAt })
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
  dispatch(
    state.tr.setMeta(pluginKey, { showStatusPickerAt, autoFocus: false }),
  );
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
    return;
  }

  let tr = state.tr;
  tr = tr.setMeta(pluginKey, { showStatusPickerAt: null, autoFocus: false });

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
