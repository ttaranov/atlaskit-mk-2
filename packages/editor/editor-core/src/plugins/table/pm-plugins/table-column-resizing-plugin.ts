import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { columnResizingPluginKey } from 'prosemirror-tables';
import { stateKey as tablePluginKey } from '../pm-plugins/main';
import { updateShadows } from '../nodeviews/TableComponent';

export const pluginKey = new PluginKey('tableColumnResizingCustomPlugin');

const updateControls = (state: EditorState) => {
  const { tableElement, tableActive } = tablePluginKey.getState(state);
  if (!tableElement) {
    return;
  }
  const tr = tableElement.querySelector('tr');

  if (!tr) {
    return;
  }

  const cols = tr.children;
  const columnControls: any = tableElement.parentElement.querySelectorAll(
    '.table-column',
  );
  const rows = tableElement.querySelectorAll('tr');
  const rowControls: any = tableElement.parentElement.parentElement.querySelectorAll(
    '.table-row',
  );
  const numberedRows = tableElement.parentElement.parentElement.querySelectorAll(
    '.numbered-row',
  );

  // update column controls width on resize
  for (let i = 0, count = columnControls.length; i < count; i++) {
    columnControls[i].style.width = `${cols[i].offsetWidth + 1}px`;
  }
  // update rows controls height on resize
  for (let i = 0, count = rowControls.length; i < count; i++) {
    rowControls[i].style.height = `${rows[i].offsetHeight + 1}px`;

    if (numberedRows.length) {
      numberedRows[i].style.height = `${rows[i].offsetHeight + 1}px`;
    }
  }

  updateShadows(
    tableElement.parentElement,
    tableElement,
    tableElement.parentElement.parentElement.querySelector(
      '.table-shadow.-left',
    ),
    tableElement.parentElement.parentElement.querySelector(
      '.table-shadow.-right',
    ),
    tableActive,
  );
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
