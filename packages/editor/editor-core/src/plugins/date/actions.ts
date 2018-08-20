import {
  EditorState,
  Transaction,
  NodeSelection,
  Selection,
} from 'prosemirror-state';
import { pluginKey } from './plugin';
import { DateType } from './index';

export const insertDate = (date?: DateType) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { schema } = state;
  let timestamp;
  if (date) {
    timestamp = Date.UTC(date.year, date.month - 1, date.day);
  } else {
    const currentDate = new Date();
    timestamp = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
  }

  const tr = state.tr;
  const { showDatePickerAt } = pluginKey.getState(state);

  if (!showDatePickerAt) {
    const dateNode = schema.nodes.date.createChecked({ timestamp });
    dispatch(tr.replaceSelectionWith(dateNode).scrollIntoView());
    return true;
  }

  if (state.doc.nodeAt(showDatePickerAt)) {
    dispatch(
      tr
        .setNodeMarkup(showDatePickerAt, schema.nodes.date, {
          timestamp,
        })
        .setSelection(Selection.near(tr.doc.resolve(showDatePickerAt + 2)))
        .setMeta(pluginKey, { showDatePickerAt: null })
        .scrollIntoView(),
    );
    return true;
  }

  return false;
};

export const setDatePickerAt = (showDatePickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { showDatePickerAt }));
  return true;
};

export const closeDatePicker = () => (state, dispatch) => {
  const { showDatePickerAt } = pluginKey.getState(state);

  if (!showDatePickerAt) {
    return false;
  }

  dispatch(
    state.tr
      .setMeta(pluginKey, { showDatePickerAt: null })
      .setSelection(Selection.near(state.tr.doc.resolve(showDatePickerAt + 2))),
  );
};

export const openDatePicker = (
  domAtPos: (pos: number) => { node: Node; offset: number },
) => (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
  const { $from } = state.selection;
  const start =
    $from.parent.childAfter($from.parentOffset).offset +
    $from.start($from.depth);
  const parent = domAtPos(start).node;
  if (parent && parent.childNodes.length) {
    const index = $from.index($from.depth);
    const element = parent.childNodes[index - 1] as HTMLElement;
    if (element) {
      const showDatePickerAt = $from.pos - 1;
      dispatch(
        state.tr
          .setMeta(pluginKey, { showDatePickerAt })
          .setSelection(NodeSelection.create(state.doc, showDatePickerAt)),
      );
    }
  }
  return false;
};
