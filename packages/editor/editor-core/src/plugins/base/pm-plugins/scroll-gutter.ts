import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';

export const GUTTER_SIZE = 96;

export default (appearance?: string) =>
  new Plugin({
    view(view: EditorView) {
      return {
        update() {
          if (appearance === 'full-page') {
            const { dom } = view;

            const focusedDom = view.domAtPos(view.state.selection.$from.pos);
            const offsetParent = (dom as HTMLElement).offsetParent;

            if (
              offsetParent &&
              focusedDom.node &&
              (focusedDom.node as HTMLElement).getBoundingClientRect
            ) {
              const domRect = (focusedDom.node as HTMLElement).getBoundingClientRect();
              const parentRect = offsetParent.getBoundingClientRect();

              const { scrollTop } = offsetParent;
              const { bottom } = parentRect;
              const { top } = domRect;
              const viewBottom = bottom + scrollTop - GUTTER_SIZE;

              if (top + scrollTop > viewBottom) {
                offsetParent.scrollTop =
                  scrollTop + (top + scrollTop) - viewBottom;
              }
            }
          }
        },
      };
    },
  });
