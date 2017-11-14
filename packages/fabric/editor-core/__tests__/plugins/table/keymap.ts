import * as sinon from 'sinon';
import tablePlugins, { TableState } from '../../../src/plugins/table';
import { TableMap, CellSelection } from 'prosemirror-tables';

import {
  doc, createEvent, makeEditor, sendKeyToPm, table, tr, td, tdEmpty, tdCursor, thEmpty, p
} from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';


describe('table keymap', () => {
  const event = createEvent('event');
  const editor = (doc: any) => makeEditor<TableState>({
    doc,
    plugins: tablePlugins(),
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
  });

  describe('Tab keypress', () => {
    describe('when the whole row is selected', () => {
      it('it should select the first cell of the next row', () => {
        const { editorView, plugin, pluginState, refs } = editor(
          doc(table(tr(tdCursor, tdEmpty ), tr(td({})(p('{nextPos}')), tdEmpty)))
        );
        const { nextPos } = refs;
        plugin.props.onFocus!(editorView, event);
        pluginState.selectRow(0);
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.next_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the whole column is selected', () => {
      it('it should select the last cell of the next column', () => {
        const { editorView, plugin, pluginState, refs } = editor(
          doc(table(tr(tdCursor, tdEmpty ), tr(tdEmpty, td({})(p('{nextPos}')))))
        );
        const { nextPos } = refs;
        plugin.props.onFocus!(editorView, event);
        pluginState.selectColumn(0);
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.next_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the cursor is at the first cell of the first row', () => {
      it('it should select next cell of the current row', () => {
        const { editorView, refs } = editor(
          doc(table(tr(tdCursor, td({})(p('{nextPos}')), tdEmpty )))
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.next_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the cursor is at the last cell of the first row', () => {
      it('it should select first cell of the next row', () => {
        const { editorView, refs } = editor(
          doc(table(
            tr(tdEmpty, tdEmpty, tdCursor ),
            tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty )
          ))
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.next_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the cursor is at the last cell of the last row', () => {
      it('it should create a new row and select the first cell of the new row', () => {
        const { editorView, pluginState } = editor(
          doc(table(
            tr(tdEmpty, tdEmpty, tdEmpty ),
            tr(tdEmpty, tdEmpty, tdCursor )
          ))
        );
        sendKeyToPm(editorView, 'Tab');
        const map = TableMap.get(pluginState.tableNode!);
        expect(map.height).toEqual(3);
        expect(editorView.state.selection.$from.pos).toEqual(32);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.next_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });
  });

  describe('Shift-Tab keypress', () => {
    describe('when the cursor is at the last cell of the first row', () => {
      it('it should select previous cell of the current row', () => {
        const { editorView, refs } = editor(
          doc(table(tr(tdEmpty, td({})(p('{nextPos}')), tdCursor )))
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.previous_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the cursor is at the first cell of the second row', () => {
      it('it should select the last cell of the first row', () => {
        const { editorView, refs } = editor(
          doc(table(
            tr(tdEmpty, tdEmpty, td({})(p('{nextPos}'))),
            tr(tdCursor, tdEmpty, tdEmpty )
          ))
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.previous_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('when the cursor is at the first cell of the first row', () => {
      it('it should create a new row and select the first cell of the new row', () => {
        const { editorView, pluginState } = editor(
          doc(table(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty,  tdEmpty)
          ))
        );
        sendKeyToPm(editorView, 'Shift-Tab');
        const map = TableMap.get(pluginState.tableNode!);
        expect(map.height).toEqual(3);
        expect(editorView.state.selection.$from.pos).toEqual(4);
        expect(editorView.state.selection.empty).toBe(true);
        expect(trackEvent.calledWith('atlassian.editor.format.table.previous_cell.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    describe('Shift-Alt-T keypress', () => {
      it('it should insert 3x3 table', () => {
        const tableNode = table(
          tr(thEmpty, thEmpty, thEmpty ),
          tr(tdEmpty, tdEmpty, tdEmpty ),
          tr(tdEmpty, tdEmpty, tdEmpty )
        );
        const { editorView } = editor(doc(p('{<>}')));
        sendKeyToPm(editorView, 'Shift-Alt-T');
        expect(editorView.state.doc).toEqualDocument(doc(tableNode));
        editorView.destroy();
      });
    });
  });

  describe('Backspace keypress', () => {
    describe('when cursor is immediately after the table', () => {
      it('it should move cursor to the last cell', () => {
        const { editorView, plugin, refs } = editor(
          doc(p('text'), table(tr(tdEmpty, td({})(p('hello{nextPos}')))), p('{<>}text'),)
        );
        const { nextPos } = refs;
        plugin.props.onFocus!(editorView, event);
        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        editorView.destroy();
      });
    });

    describe('when table is selected', () => {
      it('it should empty table cells', () => {
        const { editorView, plugin, pluginState } = editor(
          doc(table(tr(tdCursor, td({})(p('2')), td({})(p('3')))))
        );
        plugin.props.onFocus!(editorView, event);
        pluginState.selectTable();
        expect(editorView.state.selection instanceof CellSelection).toBe(true);
        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.doc).toEqualDocument(doc(table(tr(tdEmpty, tdEmpty, tdEmpty))));
        expect(trackEvent.calledWith('atlassian.editor.format.table.delete_content.keyboard')).toBe(true);
        editorView.destroy();
      });
    });

    [0, 1, 2].forEach(index => {
      describe(`when row ${index + 1} is selected`, () => {
        it(`it should empty cells in the row ${index + 1}`, () => {
          const { editorView, plugin, pluginState } = editor(
            doc(table(tr(tdEmpty, td({})(p('{<>}1'))), tr(tdEmpty, td({})(p('2'))), tr(tdEmpty, td({})(p('3')))))
          );
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(index);
          expect(editorView.state.selection instanceof CellSelection).toBe(true);
          const { selection } = editorView.state;
          const offset = pluginState.tableStartPos();
          const cursorPos = selection.$head.pos - selection.$head.parentOffset + offset!;
          sendKeyToPm(editorView, 'Backspace');
          const rows: any = [];
          for (let i = 0; i < 3; i++) {
            rows.push(tr(tdEmpty, td({})(p( i === index ? '' : `${i + 1}`))));
          }
          expect(editorView.state.doc).toEqualDocument(doc(table(rows)));
          expect(cursorPos).toEqual(editorView.state.selection.$from.pos);
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_content.keyboard')).toBe(true);
          editorView.destroy();
        });
      });

      describe(`when column ${index + 1} is selected`, () => {
        it(`it should empty cells in the column ${index + 1}`, () => {
          const emptyRow = tr(tdEmpty, tdEmpty, tdEmpty);
          const { editorView, plugin, pluginState } = editor(
            doc(table(emptyRow, tr(td({})(p('{<>}1')), td({})(p('2')), td({})(p('3')))))
          );
          plugin.props.onFocus!(editorView, event);
          pluginState.selectColumn(index);
          expect(editorView.state.selection instanceof CellSelection).toBe(true);
          const { selection } = editorView.state;
          const offset = pluginState.tableStartPos();
          const cursorPos = selection.$head.pos - selection.$head.parentOffset + offset!;
          sendKeyToPm(editorView, 'Backspace');
          const columns: any = [];
          for (let i = 0; i < 3; i++) {
            columns.push(td({})(p( i === index ? '' : `${i + 1}`)));
          }
          expect(editorView.state.doc).toEqualDocument(doc(table(emptyRow, tr(columns))));
          expect(cursorPos).toEqual(editorView.state.selection.$from.pos);
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_content.keyboard')).toBe(true);
          editorView.destroy();
        });
      });
    });
  });
});
