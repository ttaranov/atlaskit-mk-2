import { Slice } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsService } from '../../analytics';
import { taskDecisionSliceFilter } from '../../utils/filter';
import * as clipboard from '../../utils/clipboard';

export const stateKey = new PluginKey('tasksAndDecisionsPlugin');

export default function createPlugin() {
  return new Plugin({
    props: {
      handlePaste(view: EditorView, event: ClipboardEvent, slice: Slice) {
        if (!event.clipboardData) {
          return false;
        }
        console.log('into handle pasete event', event);
        console.log(
          'into handle pasete event.clipboardData',
          event.clipboardData,
        );
        const { selection, schema } = view.state;
        const { nodes } = schema;
        const { decisionList, decisionItem, taskList, taskItem } = nodes;

        if ((!decisionItem || !decisionList) && (!taskList || !taskItem)) {
          return false;
        }

        // Bail if copied content has files
        if (clipboard.isPastedFile(event)) {
          console.log('pasted content if file type');
          return true;
        }

        const { $from, $to } = selection;

        // Delegate to default paste if selection is a range
        if ($from.pos !== $to.pos) {
          return false;
        }

        const nodeType = $from.node($from.depth).type;
        if (nodeType !== decisionItem && nodeType !== taskItem) {
          // Not an action or decision, exit early
          return false;
        }

        analyticsService.trackEvent(
          'atlassian.fabric.action-decision.editor.paste',
        );

        const tr = view.state.tr.replaceSelection(
          taskDecisionSliceFilter(slice, schema),
        );
        view.dispatch(tr.scrollIntoView());

        return true;
      },
    },
    key: stateKey,
  });
}
