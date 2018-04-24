import { Command } from '../../../types';
import { findQueryMark } from '../utils/find-query-mark';

export const dismissCommand = (): Command => (state, dispatch) => {
  const { schema, doc } = state;
  const markType = schema.marks.typeAheadQuery;
  const { start, end } = findQueryMark(markType, doc, 0, doc.nodeSize - 2);
  if (start === -1) {
    return false;
  }
  dispatch(
    state.tr.removeMark(start, end, markType).removeStoredMark(markType),
  );
  return true;
};
