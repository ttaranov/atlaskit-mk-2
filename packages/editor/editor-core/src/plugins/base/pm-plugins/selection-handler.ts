import { EditorView } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';
import { PluginKey, Plugin } from 'prosemirror-state';

/**
 * This plugin fixes a strange browser behaviour where the cursor sometimes disappears
 * when the arrow keys are used for navigation. This happens because the browser in some
 * cases, when multiple non-contenteditable nodes like mention or emoji are put next to
 * eachother without any space between them, puts the cursor inside the non-contenteditable
 * node. We can fix that by clearing the selection.
 */
export const selectionStateKey = new PluginKey('selectionStatePlugin');
export default () =>
  new Plugin({
    key: selectionStateKey,
    props: {
      createSelectionBetween(view: EditorView, $anchor: ResolvedPos) {
        const selection = document.getSelection();
        const domAtPos = view.domAtPos($anchor.pos);

        const { anchorNode } = selection;
        const { node } = domAtPos;

        if (anchorNode !== node) {
          selection.removeAllRanges();
        }
      },
    },
  });
