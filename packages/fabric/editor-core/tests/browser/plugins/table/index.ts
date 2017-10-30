import { expect } from 'chai';
import * as sinon from 'sinon';
import tablePlugins, { TableState } from '../../../../src/plugins/table';
import tableCommands from '../../../../src/plugins/table/commands';
import { getColumnPos, getRowPos, getTablePos } from '../../../../src/plugins/table/utils';
import { CellSelection, TableMap } from 'prosemirror-tables';
import {
  createEvent, chaiPlugin, doc, p, makeEditor, thEmpty, table, tr, td, th,
  tdEmpty, tdCursor, code_block, code, thCursor
} from '../../../../src/test-helper';
import { setTextSelection } from '../../../../src/utils';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('table plugin', () => {
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

  describe('subscribe', () => {
    it('calls subscriber with plugin', () => {
      const { pluginState } = editor(doc(p('paragraph')));
      const spy = sinon.spy();
      pluginState.subscribe(spy);

      expect(spy.calledWith(pluginState)).to.equal(true);
    });

    context('when leaving table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(doc(p('{pPos}'), table(tr(tdCursor, tdEmpty, tdEmpty))));
        const spy = sinon.spy();
        const { pPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, pPos);

        expect(spy.callCount).to.equal(2);
        editorView.destroy();
      });
    });

    context('when entering table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(doc(p('{<>}'), table(tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty))));
        const spy = sinon.spy();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy.callCount).to.equal(2);
        editorView.destroy();
      });
    });

    context('when moving cursor to a different table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(doc(table(tr(tdCursor, tdEmpty, tdEmpty)), table(tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty))));
        const spy = sinon.spy();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy.callCount).to.equal(2);
        editorView.destroy();
      });
    });

    context('when moving within the same table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(doc(table(tr(tdCursor, tdEmpty, td({})(p('{nextPos}'))))));
        const spy = sinon.spy();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy.callCount).to.not.equal(2);
        editorView.destroy();
      });
    });

    context('when unsubscribe', () => {
      it('does not notify the subscriber', () => {
        const { pluginState } = editor(doc(table(tr(tdCursor, tdEmpty, tdEmpty))));
        const spy = sinon.spy();
        pluginState.subscribe(spy);

        pluginState.unsubscribe(spy);

        expect(spy.callCount).to.equal(1);
      });
    });
  });

  describe('editorFocued', () => {
    context('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, editorView, pluginState } = editor(doc(table(tr(tdCursor, tdEmpty, tdEmpty))));
        plugin.props.onFocus!(editorView, event);
        expect(pluginState.editorFocused).to.equal(true);
        editorView.destroy();
      });
    });

    context('when editor is not focused', () => {
      it('it is false', () => {
        const { plugin, editorView, pluginState } = editor(doc(table(tr(tdCursor, tdEmpty, tdEmpty))));
        plugin.props.onBlur!(editorView, event);
        expect(pluginState.editorFocused).to.equal(false);
        editorView.destroy();
      });
    });
  });

  describe('createTable()', () => {
    context('when the cursor is inside the table', () => {
      it('it should not create a new table and return false', () => {
        const tableNode = table(tr(tdCursor));
        const { plugin, editorView } = editor(doc(tableNode));
        plugin.props.onFocus!(editorView, event);
        expect(tableCommands.createTable()(editorView.state, editorView.dispatch)).to.equal(false);
        expect(editorView.state.doc).to.deep.equal(doc(tableNode));
        editorView.destroy();
      });
    });

    context('when the cursor is inside a codeblock', () => {
      it('it should not create a new table and return false', () => {
        const node = code_block()('{<>}');
        const { editorView } = editor(doc(node));
        expect(tableCommands.createTable()(editorView.state, editorView.dispatch)).to.equal(false);
        expect(editorView.state.doc).to.deep.equal(doc(node));
        editorView.destroy();
      });
    });

    context('when the cursor is inside inline code', () => {
      it('it should not create a new table and return false', () => {
        const node = p(code('te{<>}xt'));
        const { editorView } = editor(doc(node));
        expect(tableCommands.createTable()(editorView.state, editorView.dispatch)).to.equal(false);
        expect(editorView.state.doc).to.deep.equal(doc(node));
        editorView.destroy();
      });
    });

    context('when the cursor is outside the table', () => {
      it('it should create a new table and return true', () => {
        const { editorView } = editor(doc(p('{<>}')));
        expect(tableCommands.createTable()(editorView.state, editorView.dispatch)).to.equal(true);
        const tableNode = table(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty)
        );
        expect(editorView.state.doc).to.deep.equal(doc(tableNode));
        editorView.destroy();
      });
    });
  });

  describe('insertColumn(number)', () => {
    context('when table has 2 columns', () => {
      context('when it called with 0', () => {
        it('it should prepend a new column and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('c1')), td({})(p('c2{<>}'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertColumn(0);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor, td({})(p('c1')), td({})(p('c2'))))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.column.button')).to.equal(true);
          editorView.destroy();
        });
      });

      context('when it called with 1', () => {
        it('it should insert a new column in the middle and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('c1{<>}')), td({})(p('c2'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertColumn(1);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(td({})(p('c1')), tdCursor, td({})(p('c2'))))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.column.button')).to.equal(true);
          editorView.destroy();
        });
      });

      context('when it called with 2', () => {
        it('it should append a new column and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('c1{<>}')), td({})(p('c2'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertColumn(2);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(td({})(p('c1')), td({})(p('c2')), tdCursor))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.column.button')).to.equal(true);
          editorView.destroy();
        });
      });
    });

  });

  describe('insertRow(number)', () => {
    context('when table has 2 rows', () => {
      context('when it called with 0', () => {
        it('it should prepend a new row and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('row1'))), tr(td({})(p('row2{<>}'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertRow(0);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor), tr(td({})(p('row1'))), tr(td({})(p('row2'))))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.row.button')).to.equal(true);
          editorView.destroy();
        });
      });

      context('when it called with 1', () => {
        it('it should insert a new row in the middle and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertRow(1);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(td({})(p('row1'))), tr(tdCursor), tr(td({})(p('row2'))))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.row.button')).to.equal(true);
          editorView.destroy();
        });
      });
    });

    context('when table has 2 row', () => {
      context('when it called with 2', () => {
        it('it should append a new row and move cursor inside it\'s first cell', () => {
          const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2'))))));
          plugin.props.onFocus!(editorView, event);
          pluginState.insertRow(2);
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(td({})(p('row1'))), tr(td({})(p('row2'))), tr(tdCursor))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.row.button')).to.equal(true);
          editorView.destroy();
        });
      });
    });
  });

  describe('selectColumn(number)', () => {
    context('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        context(`when called with ${column}`, () => {
          it(`it should select ${column} column`, () => {
            const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))));
            plugin.props.onFocus!(editorView, event);
            pluginState.selectColumn(column);
            const selection = (editorView.state.selection as any) as CellSelection;
            const map = TableMap.get(pluginState.tableNode!);
            const start = selection.$anchorCell.start(-1);
            const anchor = map.colCount(selection.$anchorCell.pos - start);
            const head = map.colCount(selection.$headCell.pos - start);
            expect(anchor).to.equal(column);
            expect(head).to.equal(column);
            expect(selection.isColSelection()).to.equal(true);
            editorView.destroy();
          });
        });
      });
    });
  });

  describe('selectRow(number)', () => {
    context('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        context(`when called with ${row}`, () => {
          it(`it should select ${row} row`, () => {
            const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))));
            plugin.props.onFocus!(editorView, event);
            pluginState.selectRow(row);
            const selection = (editorView.state.selection as any) as CellSelection;
            const anchor = selection.$anchorCell.index(-1);
            const head = selection.$headCell.index(-1);
            expect(anchor).to.equal(row);
            expect(head).to.equal(row);
            expect(selection.isRowSelection()).to.equal(true);
            editorView.destroy();
          });
        });
      });
    });
  });

  describe('selectTable()', () => {
    it('it should select the whole table', () => {
      const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))));
      plugin.props.onFocus!(editorView, event);
      pluginState.selectTable();
      const selection =(editorView.state.selection as any) as CellSelection;
      expect(selection.isRowSelection()).to.equal(true);
      expect(selection.isColSelection()).to.equal(true);
      editorView.destroy();
    });
  });

  describe('isColumnSelected(number)', () => {
    context('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        context(`when column ${column} is selected`, () => {
          context(`when called with ${column}`, () => {
            it(`it should return true`, () => {
              const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))));
              plugin.props.onFocus!(editorView, event);
              pluginState.selectColumn(column);
              expect(pluginState.isColumnSelected(column)).to.equal(true);
              editorView.destroy();
            });
          });
        });
      });
    });
  });

  describe('isRowSelected(number)', () => {
    context('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        context(`when row ${row} is selected`, () => {
          context(`when called with ${row}`, () => {
            it(`it should return true`, () => {
              const { plugin, pluginState, editorView } = editor(doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))));
              plugin.props.onFocus!(editorView, event);
              pluginState.selectRow(row);
              expect(pluginState.isRowSelected(row)).to.equal(true);
              editorView.destroy();
            });
          });
        });
      });
    });
  });

  describe('remove()', () => {
    context('when table has 3 columns', () => {
      context('when the first column is selected', () => {
        it('it should remove the first column and move cursor to the first cell of the column to the left', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(td({})(p('{nextPos}')), tdCursor, tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectColumn(0);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor, tdEmpty))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_column.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });

      context('when the middle column is selected', () => {
        it('it should remove the middle column and move cursor to the first cell of the column to the left', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(td({})(p('{nextPos}')), tdCursor, tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectColumn(1);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor, tdEmpty))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_column.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });

      context('when the header row is selected', () => {
        const editorTableHeader = (doc: any) => makeEditor<TableState>({
          doc,
          plugins: tablePlugins({ isHeaderRowRequired: true }),
        });
        it('it should convert first following row to header if pluginState.isHeaderRowRequired is true', () => {
          const { plugin, pluginState, editorView } = editorTableHeader(doc(table(tr(thCursor), tr(tdEmpty), tr(tdEmpty))));
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(0);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(table(tr(th({})(p())), tr(tdEmpty))));
          editorView.destroy();
        });

        it('it should move cursor to the first cell of the new header row', () => {
          const { plugin, pluginState, editorView, refs } = editorTableHeader(doc(table(tr(th({})(p('{nextPos}testing{<>}'))), tr(tdEmpty), tr(tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(0);
          pluginState.remove();
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          expect(editorView.state.selection.$to.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });

      context('when the last column is selected', () => {
        it('it should remove the last column and move cursor to the first cell of the previous column', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(tdCursor, td({})(p('{nextPos}')), tdCursor))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectColumn(2);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor, tdEmpty))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_column.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });
    });

    context('when table has 3 rows', () => {
      context('when the first row is selected', () => {
        it('it should remove the first row and move cursor to the first cell of the first row', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(td({})(p('{nextPos}'))), tr(tdCursor), tr(tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(0);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdCursor), tr(tdEmpty))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_row.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });

      context('when the middle row is selected', () => {
        it('it should remove the middle row and move cursor to the first cell of the next row', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(tdCursor), tr(td({})(p('{nextPos}'))), tr(tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(1);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdEmpty), tr(tdCursor))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_row.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });

      context('when the last row is selected', () => {
        it('it should remove the middle row and move cursor to the first cell of the previous row', () => {
          const { plugin, pluginState, editorView, refs } = editor(doc(p('text'), table(tr(tdCursor), tr(td({})(p('{nextPos}'))), tr(tdEmpty))));
          const { nextPos } = refs;
          plugin.props.onFocus!(editorView, event);
          pluginState.selectRow(2);
          pluginState.remove();
          expect(editorView.state.doc).to.deep.equal(doc(p('text'), table(tr(tdEmpty), tr(tdCursor))));
          expect(trackEvent.calledWith('atlassian.editor.format.table.delete_row.button')).to.equal(true);
          expect(editorView.state.selection.$from.pos).to.equal(nextPos);
          editorView.destroy();
        });
      });
    });
  });

  describe('hoverColumn(number)', () => {
    context('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        context(`when called with ${column}`, () => {
          it(`it should create a hover selection of ${column} column`, () => {
            const { pluginState } = editor(doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))));
            pluginState.hoverColumn(column);
            const { hoveredCells, tableNode } = pluginState;
            const offset = pluginState.tableStartPos();
            const {from, to} = getColumnPos(column, tableNode!);
            expect(hoveredCells[0].pos).to.equal(from + offset!);
            expect(hoveredCells[hoveredCells.length - 1].pos).to.equal(to + offset!);
          });
        });
      });
    });
  });

  describe('hoverRow(number)', () => {
    context('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        context(`when called with ${row}`, () => {
          it(`it should create a hover selection of ${row} row`, () => {
            const { pluginState } = editor(doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))));
            pluginState.hoverRow(row);
            const { hoveredCells, tableNode } = pluginState;
            const offset = pluginState.tableStartPos();
            const {from, to} = getRowPos(row, tableNode!);
            expect(hoveredCells[0].pos).to.equal(from + offset!);
            expect(hoveredCells[hoveredCells.length - 1].pos).to.equal(to + offset!);
          });
        });
      });
    });
  });

  describe('hoverTable()', () => {
    context('when table has 3 rows', () => {
      it(`it should create a hover selection of the whole table`, () => {
        const { pluginState } = editor(doc(p('text'), table(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))));
        pluginState.hoverTable();
        const { hoveredCells, tableNode } = pluginState;
        const offset = pluginState.tableStartPos();
        const {from, to} = getTablePos(tableNode!);
        expect(hoveredCells[0].pos).to.equal(from + offset!);
        expect(hoveredCells[hoveredCells.length - 1].pos).to.equal(to + offset!);
      });
    });
  });

  describe('resetHoverSelection()', () => {
    it('should reset hoveredCells to an empty array', () => {
      const { pluginState } = editor(doc(p('text'), table(tr(tdCursor, tdEmpty))));
      pluginState.hoverTable();
      expect(pluginState.hoveredCells.length).to.equal(2);
      pluginState.resetHoverSelection();
      expect(pluginState.hoveredCells).to.deep.equal([]);
    });
  });

});
