import { Command } from '../../../types';
import { findQueryMark } from '../utils/find-query-mark';
import { analyticsService } from '../../../analytics';

export const dismissCommand = (): Command => (state, dispatch) => {
  const { schema, doc } = state;
  const markType = schema.marks.typeAheadQuery;
  const { start, end } = findQueryMark(markType, doc, 0, doc.nodeSize - 2);
  if (start === -1) {
    return false;
  }

  analyticsService.trackEvent('atlassian.editor.typeahead.dismiss');

  dispatch(
    state.tr.removeMark(start, end, markType).removeStoredMark(markType),
  );
  return true;
};
