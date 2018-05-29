import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { columnResizingPluginKey } from 'prosemirror-tables';
import { stateKey as tablePluginKey } from '../pm-plugins/main';

export const pluginKey = new PluginKey('tableColumnResizingCustomPlugin');

const updateControls = (state: EditorState) => {
  const { tableElement } = tablePluginKey.getState(state);
  if (!tableElement) {
    return;
  }

  const cols = tableElement.querySelector('tr')!.children;
  const columnControls: any = tableElement.parentElement.querySelectorAll(
    '.table-column',
  );
  const rows = tableElement.querySelectorAll('tr');
  const rowControls: any = tableElement.parentElement.parentElement.querySelectorAll(
    '.table-row',
  );

  // update column controls width on resize
  for (let i = 0, count = columnControls.length; i < count; i++) {
    columnControls[i].style.width = `${cols[i].offsetWidth + 1}px`;
  }
  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    rowControls[i].style.height = `${rows[i].offsetHeight + 1}px`;
  }

  const rightShadow = tableElement.parentElement.parentElement.querySelector(
    '.table-shadow.-right',
  );
  if (rightShadow) {
    const { offsetWidth, scrollLeft } = tableElement.parentElement;
    const diff = tableElement.offsetWidth - offsetWidth;
    const scrollDiff = scrollLeft - diff > 0 ? scrollLeft - diff : 0;
    const width = diff > 0 ? Math.min(diff, 10) : 0;
    const container = tableElement.parentElement.parentElement;

    const paddingLeft = getComputedStyle(container).paddingLeft;
    const paddingLeftPx = paddingLeft
      ? Number(paddingLeft.substr(0, paddingLeft.length - 2))
      : 0;

    const rightShadowX = offsetWidth - width - scrollDiff + paddingLeftPx;
    rightShadow.style.left = `${rightShadowX}px`;
    rightShadow.style.width = `${rightShadowX > 0 ? width : 0}px`;
  }
};

const plugin = new Plugin({
  key: pluginKey,
  props: {
    handleDOMEvents: {
      mousemove(view: EditorView) {
        const { dragging } = columnResizingPluginKey.getState(view.state);
        if (dragging) {
          updateControls(view.state);
        }
        return false;
      },
      mouseleave(view: EditorView) {
        updateControls(view.state);
        return false;
      },
    },

    attributes: () => ({ class: 'table-resizing' }),
  },
});

export default plugin;
