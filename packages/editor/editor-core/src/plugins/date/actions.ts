import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
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
  const dateNode = schema.nodes.date.create({ timestamp });
  dispatch(
    state.tr
      .replaceSelectionWith(dateNode)
      .scrollIntoView()
      .setMeta(pluginKey, { element: null }),
  );
  return true;
};

export const selectElement = (element: HTMLElement | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { element }));
  return true;
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
      dispatch(
        state.tr
          .setMeta(pluginKey, { element })
          .setSelection(NodeSelection.create(state.doc, $from.pos - 1)),
      );
    }
  }
  return false;
};
