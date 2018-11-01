import { hasParentNodeOfType } from 'prosemirror-utils';
import { taskDecisionSliceFilter } from '../../utils/filter';
import { linkifyContent } from '../hyperlink/utils';
import { analyticsService } from '../../analytics';
import { Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { runMacroAutoConvert } from '../macro';
import { closeHistory } from 'prosemirror-history';
import { getPasteSource } from './util';
import { queueCardsFromChangedTr } from '../card/pm-plugins/doc';

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
        slice = taskDecisionSliceFilter(slice, state.schema);
        slice = linkifyContent(state.schema, slice);
        const tr = closeHistory(state.tr)
          .replaceSelection(slice)
          .scrollIntoView();

        queueCardsFromChangedTr(state, tr);
        dispatch(tr);
        return true;
      }
    }
  }
  return false;
};

export const handlePasteAsPlainText = (slice: Slice, event: ClipboardEvent) => (
  state: EditorState,
  dispatch,
  view: EditorView,
): boolean => {
  // In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
  // fuzzy matching of content. ProseMirror already handles this scenario and will
  // provide us with slice containing paragraphs with plain text, which we decorate
  // with "stored marks".
  // @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
  // @see prosemirror-view/src/input.js:doPaste().
  const tr = closeHistory(state.tr);
  if ((view as any).shiftKey) {
    // <- using the same internal flag that prosemirror-view is using
    analyticsService.trackEvent('atlassian.editor.paste.alt', {
      source: getPasteSource(event),
    });

    tr.replaceSelection(slice);
    (state.storedMarks || []).forEach(mark => {
      tr.addMark(tr.selection.from, tr.selection.from + slice.size, mark);
    });
    tr.scrollIntoView();
    dispatch(tr);
    return true;
  }
  return false;
};

export const handleMacroAutoConvert = (text: string, slice: Slice) => (
  state: EditorState,
  dispatch,
  view: EditorView,
) => {
  const macro = runMacroAutoConvert(state, text);
  if (macro) {
    const selection = state.tr.selection;
    const tr = state.tr.replaceSelection(slice);
    const before = tr.mapping.map(selection.from, -1);

    // insert the text or linkified/md-converted clipboard data
    dispatch(tr);

    // replace the text with the macro as a separate transaction
    // so the autoconversion generates 2 undo steps
    dispatch(
      closeHistory(view.state.tr)
        .replaceRangeWith(before, before + slice.size, macro)
        .scrollIntoView(),
    );
  }
  return !!macro;
};
