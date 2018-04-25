import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import { GapCursorSelection, JSON_ID, Side } from '../selection';
import { handleKeyDown } from './keymap';
import { fixCursorAlignment } from '../utils';

export const pluginKey = new PluginKey('gapCursorPlugin');

const plugin = new Plugin({
  key: pluginKey,

  // this hack fixes gap cursor alignment on each cursor movement after its been rendered to DOM
  view: () => {
    return {
      update(view: EditorView, prev: EditorState) {
        const { selection } = view.state;
        if (selection instanceof GapCursorSelection) {
          fixCursorAlignment(view);
        }
      },
    };
  },

  props: {
    decorations: ({ doc, selection }: EditorState) => {
      if (selection instanceof GapCursorSelection) {
        const { $from, side } = selection;
        const node = document.createElement('span');
        node.className = `ProseMirror-gapcursor ${
          side === Side.LEFT ? '-left' : '-right'
        }`;
        node.appendChild(document.createElement('span'));

        // render decoration DOM node always to the left of the target node even if selection points to the right
        // otherwise positioning of the right gap cursor is a nightmare when the target node has a nodeView with vertical margins
        let position = selection.head;
        if (side === Side.RIGHT && $from.nodeBefore) {
          const nodeBeforeStart = findPositionOfNodeBefore(selection);
          if (typeof nodeBeforeStart === 'number') {
            position = nodeBeforeStart - 1;
          }
        }

        return DecorationSet.create(doc, [
          Decoration.widget(position, node, { key: `${JSON_ID}` }),
        ]);
      }

      return null;
    },

    // render gap cursor only when its valid
    createSelectionBetween(
      view: EditorView,
      $anchor: ResolvedPos,
      $head: ResolvedPos,
    ) {
      if ($anchor.pos === $head.pos && GapCursorSelection.valid($head)) {
        return new GapCursorSelection($head);
      }
      return;
    },

    handleKeyDown,
  },
});

export default plugin;
