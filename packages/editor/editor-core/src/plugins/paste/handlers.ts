import { hasParentNodeOfType } from 'prosemirror-utils';
import { taskDecisionSliceFilter } from '../../utils/filter';
import { analyticsService } from '../../analytics';
import { Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { closeHistory } from 'prosemirror-history';

export const handlePasteIntoTaskAndDecision = (slice: Slice) => (
  state: EditorState,
  dispatch,
): boolean => {
  const {
    schema: {
      nodes: { decisionItem, decisionList, taskList, taskItem },
    },
  } = state;
  if (decisionItem && decisionList && taskList && taskItem) {
    if (hasParentNodeOfType([decisionItem, taskItem])(state.selection)) {
      if (state.selection.empty) {
        analyticsService.trackEvent(
          'atlassian.fabric.action-decision.editor.paste',
        );
        const tr = closeHistory(state.tr);
        tr.replaceSelection(taskDecisionSliceFilter(slice, state.schema));
        dispatch(tr.scrollIntoView());
        return true;
      }
    }
  }
  return false;
};
