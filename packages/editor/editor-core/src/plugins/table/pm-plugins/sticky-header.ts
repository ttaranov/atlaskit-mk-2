import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Dispatch } from '../../../event-dispatcher';

export const pluginKey = new PluginKey('stickyHeader');

export const handleScroll = (dispatch: Dispatch, view: EditorView) => () => {
  const { offsetParent } = view.dom as HTMLElement;

  if (!offsetParent) {
    dispatch(pluginKey, { table: undefined });
    return;
  }

  const parentRect = offsetParent.getBoundingClientRect();
  const { scrollTop } = offsetParent;

  if (scrollTop === 0) {
    dispatch(pluginKey, { table: undefined });
    return;
  }

  const tables = view.dom.querySelectorAll('table');

  const table = [...Array.from(tables)].find(t => {
    const tableRect = t.getBoundingClientRect();

    if (tableRect.top < parentRect.top && tableRect.bottom > parentRect.top) {
      return true;
    }

    return false;
  });

  const tableRect = table && table.getBoundingClientRect();

  dispatch(pluginKey, {
    table,
    top: parentRect.top,
    left: tableRect && tableRect.left,
    width: tableRect && tableRect.width,
  });
};

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    key: pluginKey,
    view(editorView: EditorView) {
      const { offsetParent } = editorView.dom as HTMLElement;
      const scrollHandler = handleScroll(dispatch, editorView);

      if (!offsetParent) {
        return {};
      }

      offsetParent.addEventListener('scroll', scrollHandler);

      return {
        update(view: EditorView) {},

        destroy() {
          offsetParent.removeEventListener('scroll', scrollHandler);
        },
      };
    },
  });
