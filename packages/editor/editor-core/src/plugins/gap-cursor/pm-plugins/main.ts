import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import { GapCursorSelection, JSON_ID, Side } from '../selection';
import { fixCursorAlignment, isIgnoredClick } from '../utils';
import { setGapCursorAtPos } from '../actions';

export const pluginKey = new PluginKey('gapCursorPlugin');

const plugin = new Plugin({
  key: pluginKey,

  // this hack fixes gap cursor alignment on each cursor movement after its been rendered to DOM
  view: () => {
    return {
      update(view: EditorView) {
        if (view.state.selection instanceof GapCursorSelection) {
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
            position = nodeBeforeStart;
          }
        }

        return DecorationSet.create(doc, [
          Decoration.widget(position, node, { key: `${JSON_ID}`, side: -1 }),
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

    // there's no space between top level nodes and the wrapping ProseMirror contenteditable area and handleClick won't capture clicks, there's nothing to click on
    // it handles only attempts to set gap cursor for nested nodes, where we have space between parent and child nodes
    // top level nodes are handled by <ClickAreaBlock>
    handleClick(view: EditorView, position: number, event: MouseEvent) {
      const posAtCoords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      // this helps to ignore all of the clicks outside of the parent (e.g. nodeView controls)
      if (
        posAtCoords &&
        posAtCoords.inside !== position &&
        !isIgnoredClick(event.target as HTMLElement)
      ) {
        // max available space between parent and child from the left side in px
        // this ensures the correct side of the gap cursor in case of clicking in between two block nodes
        const leftSideOffsetX = 20;
        const side = event.offsetX > leftSideOffsetX ? Side.RIGHT : Side.LEFT;
        return setGapCursorAtPos(position, side)(view.state, view.dispatch);
      }
      return false;
    },
  },
});

export default plugin;
