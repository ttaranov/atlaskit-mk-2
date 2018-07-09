import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { columnResizingPluginKey } from 'prosemirror-tables';
import { getPluginState } from '../pm-plugins/main';
import { updateShadows } from '../nodeviews/TableComponent';
import { getLineMarkerWidth } from '../ui/TableFloatingControls/utils';

export const pluginKey = new PluginKey('tableColumnResizingCustomPlugin');

const updateControls = (state: EditorState) => {
  const { tableRef } = getPluginState(state);
  if (!tableRef) {
    return;
  }
  const tr = tableRef.querySelector('tr');
  if (!tr) {
    return;
  }
  const cols = tr.children;
  const wrapper = tableRef.parentElement;
  const columnControls: any = wrapper.querySelectorAll('.table-column');
  const rows = tableRef.querySelectorAll('tr');
  const rowControls: any = wrapper.parentElement.querySelectorAll('.table-row');
  const numberedRows = wrapper.parentElement.querySelectorAll('.numbered-row');

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

  const rowMarkers: any = wrapper.parentElement.querySelectorAll(
    '.ProseMirror-table-insert-row-marker',
  );

  // update row insert marker (blue horizontal line)
  for (let i = 0, count = rowMarkers.length; i < count; i++) {
    const width = getLineMarkerWidth(tableRef, wrapper.scrollLeft);
    rowMarkers[i].style.width = `${width}px`;
  }

  updateShadows(
    wrapper,
    tableRef,
    wrapper.parentElement.querySelector('.table-shadow.-left'),
    wrapper.parentElement.querySelector('.table-shadow.-right'),
    !!tableRef,
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
