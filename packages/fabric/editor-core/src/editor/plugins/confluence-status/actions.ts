import { EditorState, Transaction } from 'prosemirror-state';

export const insertStatus = (status?: string) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { schema } = state;
  const { $from, $to } = state.selection;
  const statusMark = schema.marks.confluenceStatus.create({ status });
  dispatch(
    state.tr
      .addMark($from.pos, $to.pos, statusMark)
      .setStoredMarks([statusMark]),
  );
  return true;
};
