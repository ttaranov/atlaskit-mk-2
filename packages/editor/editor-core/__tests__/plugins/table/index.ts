import {
  TableState,
  stateKey as tablePluginKey,
} from '../../../src/plugins/table/pm-plugins/main';
import tableCommands from '../../../src/plugins/table/commands';
import { CellSelection, TableMap } from 'prosemirror-tables';
import {
  createEvent,
  doc,
  p,
  createEditor,
  thEmpty,
  table,
  tableWithAttrs,
  tr,
  td,
  th,
  tdEmpty,
  tdCursor,
  code_block,
  code,
  thCursor,
  strong,
  mediaGroup,
  media,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { setTextSelection, setNodeSelection } from '../../../src/utils';
import {
  selectRow,
  selectColumn,
  selectTable,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
} from '../../../src/plugins/table/actions';
import {
  checkIfColumnSelected,
  checkIfRowSelected,
  checkIfNumberColumnEnabled,
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
} from '../../../src/plugins/table/utils';
import tablesPlugin from '../../../src/plugins/table';
import codeBlockPlugin from '../../../src/plugins/code-block';
import { mediaPlugin } from '../../../src/plugins';

describe('table plugin', () => {
  const event = createEvent('event');
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin, codeBlockPlugin, mediaPlugin()],
      editorProps: {
        analyticsHandler: trackEvent,
        allowTables: {
          allowNumberColumn: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
        },
      },
      pluginKey: tablePluginKey,
    });

  let trackEvent;
  beforeEach(() => {
    trackEvent = jest.fn();
  });

  describe('subscribe', () => {
    it('calls subscriber with plugin', () => {
      const { pluginState } = editor(doc(p('paragraph')));
      const spy = jest.fn();
      pluginState.subscribe(spy);

      expect(spy).toHaveBeenCalledWith(pluginState);
    });

    it('should not be possible to add same listener twice', () => {
      const { pluginState } = editor(doc(p('paragraph')));
      const spy1 = jest.fn();
      pluginState.subscribe(spy1);
      pluginState.subscribe(spy1);

      expect(spy1).toHaveBeenCalledTimes(1);
    });

    describe('when leaving table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('{pPos}'), table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const spy = jest.fn();
        const { pPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, pPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when entering table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(p('{<>}'), table(tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty))),
        );
        const spy = jest.fn();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when moving cursor to a different table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(
            table(tr(tdCursor, tdEmpty, tdEmpty)),
            table(tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty)),
          ),
        );
        const spy = jest.fn();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy).toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when moving within the same table', () => {
      it('notifies subscriber', () => {
        const { refs, pluginState, editorView } = editor(
          doc(table(tr(tdCursor, tdEmpty, td({})(p('{nextPos}'))))),
        );
        const spy = jest.fn();
        const { nextPos } = refs;

        pluginState.subscribe(spy);
        setTextSelection(editorView, nextPos);

        expect(spy).not.toHaveBeenCalledTimes(2);
        editorView.destroy();
      });
    });

    describe('when unsubscribe', () => {
      it('does not notify the subscriber', () => {
        const { pluginState } = editor(
          doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const spy = jest.fn();
        pluginState.subscribe(spy);

        pluginState.unsubscribe(spy);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('editorFocued', () => {
    describe('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, editorView, pluginState } = editor(
          doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(pluginState.editorFocused).toEqual(true);
        editorView.destroy();
      });
    });

    describe('when editor is not focused', () => {
      it('it is false', () => {
        const { plugin, editorView, pluginState } = editor(
          doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.editorFocused).toEqual(false);
        editorView.destroy();
      });
    });
  });

  describe('createTable()', () => {
    describe('when the cursor is inside the table', () => {
      it('it should not create a new table and return false', () => {
        const tableNode = table(tr(tdCursor));
        const { plugin, editorView } = editor(doc(tableNode));
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(
          tableCommands.createTable()(editorView.state, editorView.dispatch),
        ).toEqual(false);
        expect(editorView.state.doc).toEqualDocument(doc(tableNode));
        editorView.destroy();
      });
    });

    describe('when the cursor is inside a codeblock', () => {
      it('it should not create a new table and return false', () => {
        const node = code_block()('{<>}');
        const { editorView } = editor(doc(node));
        expect(
          tableCommands.createTable()(editorView.state, editorView.dispatch),
        ).toEqual(false);
        expect(editorView.state.doc).toEqualDocument(doc(node));
        editorView.destroy();
      });
    });

    describe('when the cursor is inside inline code', () => {
      it('it should not create a new table and return false', () => {
        const node = p(code('te{<>}xt'));
        const { editorView } = editor(doc(node));
        expect(
          tableCommands.createTable()(editorView.state, editorView.dispatch),
        ).toEqual(false);
        expect(editorView.state.doc).toEqualDocument(doc(node));
        editorView.destroy();
      });
    });

    describe('when the cursor is outside the table', () => {
      it('it should create a new table and return true', () => {
        const { editorView } = editor(doc(p('{<>}')));
        expect(
          tableCommands.createTable()(editorView.state, editorView.dispatch),
        ).toEqual(true);
        const tableNode = table(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        );
        expect(editorView.state.doc).toEqualDocument(doc(tableNode));
        editorView.destroy();
      });
    });

    describe('when selection has a mark', () => {
      it('it should create a new table and return true', () => {
        const { editorView } = editor(doc(p(strong('text{<>}'))));
        expect(
          tableCommands.createTable()(editorView.state, editorView.dispatch),
        ).toEqual(true);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong('text')),
            table(
              tr(thEmpty, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
        editorView.destroy();
      });
    });
  });

  describe('insertColumn(number)', () => {
    describe('when table has 2 columns', () => {
      describe('when it called with 0', () => {
        it("it should prepend a new column and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(p('text'), table(tr(td({})(p('c1')), td({})(p('c2{<>}'))))),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertColumn(0);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(tdCursor, td({})(p('c1')), td({})(p('c2')))),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.column.button',
          );
          editorView.destroy();
        });
      });

      describe('when it called with 1', () => {
        it("it should insert a new column in the middle and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(p('text'), table(tr(td({})(p('c1{<>}')), td({})(p('c2'))))),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertColumn(1);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(td({})(p('c1')), tdCursor, td({})(p('c2')))),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.column.button',
          );
          editorView.destroy();
        });
      });

      describe('when it called with 2', () => {
        it("it should append a new column and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(p('text'), table(tr(td({})(p('c1{<>}')), td({})(p('c2'))))),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertColumn(2);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(td({})(p('c1')), td({})(p('c2')), tdCursor)),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.column.button',
          );
          editorView.destroy();
        });
      });
    });
  });

  describe('insertRow(number)', () => {
    describe('when table has 2 rows', () => {
      describe('when it called with 0', () => {
        it("it should prepend a new row and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('row1'))), tr(td({})(p('row2{<>}')))),
            ),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertRow(0);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(tdCursor), tr(td({})(p('row1'))), tr(td({})(p('row2')))),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.row.button',
          );
          editorView.destroy();
        });
      });

      describe('when it called with 1', () => {
        it("it should insert a new row in the middle and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2')))),
            ),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertRow(1);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(td({})(p('row1'))), tr(tdCursor), tr(td({})(p('row2')))),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.row.button',
          );
          editorView.destroy();
        });
      });
    });

    describe('when table has 2 row', () => {
      describe('when it called with 2', () => {
        it("it should append a new row and move cursor inside it's first cell", () => {
          const { plugin, pluginState, editorView } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('row1{<>}'))), tr(td({})(p('row2')))),
            ),
            trackEvent,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertRow(2);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              table(tr(td({})(p('row1'))), tr(td({})(p('row2'))), tr(tdCursor)),
            ),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.row.button',
          );
          editorView.destroy();
        });
      });
    });
  });

  describe('selectColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when called with ${column}`, () => {
          it(`it should select ${column} column`, () => {
            const { plugin, pluginState, editorView } = editor(
              doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
            );
            plugin.props.handleDOMEvents!.focus(editorView, event);
            selectColumn(column)(editorView.state, editorView.dispatch);
            const selection = (editorView.state
              .selection as any) as CellSelection;
            const map = TableMap.get(pluginState.tableNode!);
            const start = selection.$anchorCell.start(-1);
            const anchor = map.colCount(selection.$anchorCell.pos - start);
            const head = map.colCount(selection.$headCell.pos - start);
            expect(anchor).toEqual(column);
            expect(head).toEqual(column);
            expect(selection.isColSelection()).toEqual(true);
            editorView.destroy();
          });
        });
      });
    });
  });

  describe('selectRow(number)', () => {
    describe('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        describe(`when called with ${row}`, () => {
          it(`it should select ${row} row`, () => {
            const { plugin, editorView } = editor(
              doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
            );
            plugin.props.handleDOMEvents!.focus(editorView, event);
            selectRow(row)(editorView.state, editorView.dispatch);
            const selection = (editorView.state
              .selection as any) as CellSelection;
            const anchor = selection.$anchorCell.index(-1);
            const head = selection.$headCell.index(-1);
            expect(anchor).toEqual(row);
            expect(head).toEqual(row);
            expect(selection.isRowSelection()).toEqual(true);
            editorView.destroy();
          });
        });
      });
    });
  });

  describe('selectTable()', () => {
    it('it should select the whole table', () => {
      const { plugin, editorView } = editor(
        doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      selectTable(editorView.state, editorView.dispatch);
      const selection = (editorView.state.selection as any) as CellSelection;
      expect(selection.isRowSelection()).toEqual(true);
      expect(selection.isColSelection()).toEqual(true);
      editorView.destroy();
    });
  });

  describe('checkIfColumnSelected(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when column ${column} is selected`, () => {
          describe(`when called with ${column}`, () => {
            it(`it should return true`, () => {
              const { plugin, editorView } = editor(
                doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
              );
              plugin.props.handleDOMEvents!.focus(editorView, event);
              selectColumn(column)(editorView.state, editorView.dispatch);
              expect(checkIfColumnSelected(column, editorView.state)).toEqual(
                true,
              );
              editorView.destroy();
            });
          });
        });
      });
    });
  });

  describe('checkIfRowSelected(number)', () => {
    describe('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        describe(`when row ${row} is selected`, () => {
          describe(`when called with ${row}`, () => {
            it(`it should return true`, () => {
              const { plugin, editorView } = editor(
                doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
              );
              plugin.props.handleDOMEvents!.focus(editorView, event);
              selectRow(row)(editorView.state, editorView.dispatch);
              expect(checkIfRowSelected(row, editorView.state)).toEqual(true);
              editorView.destroy();
            });
          });
        });
      });
    });
  });

  describe('remove()', () => {
    describe('when table has 3 columns', () => {
      describe('when the first column is selected', () => {
        it('it should remove the first column and move cursor to the first cell of the column to the left', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('{nextPos}')), tdCursor, tdEmpty)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectColumn(0)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdCursor, tdEmpty))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_column.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });

      describe('when the middle column is selected', () => {
        it('it should remove the middle column and move cursor to the first cell of the column to the left', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('{nextPos}')), tdCursor, tdEmpty)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectColumn(1)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdCursor, tdEmpty))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_column.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });

      describe('when the header row is selected', () => {
        const editorTableHeader = (doc: any) =>
          createEditor<TableState>({
            doc,
            editorPlugins: [tablesPlugin],
            editorProps: {
              allowTables: {
                isHeaderRowRequired: true,
              },
            },
            pluginKey: tablePluginKey,
          });

        it('it should convert first following row to header if pluginState.isHeaderRowRequired is true', () => {
          const { plugin, pluginState, editorView } = editorTableHeader(
            doc(table(tr(thCursor), tr(tdEmpty), tr(tdEmpty))),
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectRow(0)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(table(tr(th({})(p())), tr(tdEmpty))),
          );
          editorView.destroy();
        });

        it('it should move cursor to the first cell of the new header row', () => {
          const { plugin, pluginState, editorView, refs } = editorTableHeader(
            doc(
              table(
                tr(th({})(p('{nextPos}testing{<>}'))),
                tr(tdEmpty),
                tr(tdEmpty),
              ),
            ),
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectRow(0)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          expect(editorView.state.selection.$to.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });

      describe('when the last column is selected', () => {
        it('it should remove the last column and move cursor to the first cell of the previous column', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(tdCursor, td({})(p('{nextPos}')), tdCursor)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectColumn(2)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdCursor, tdEmpty))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_column.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });
    });

    describe('when table has 3 rows', () => {
      describe('when the first row is selected', () => {
        it('it should remove the first row and move cursor to the first cell of the first row', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(td({})(p('{nextPos}'))), tr(tdCursor), tr(tdEmpty)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectRow(0)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdCursor), tr(tdEmpty))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_row.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });

      describe('when the middle row is selected', () => {
        it('it should remove the middle row and move cursor to the first cell of the next row', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(tdCursor), tr(td({})(p('{nextPos}'))), tr(tdEmpty)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectRow(1)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdEmpty), tr(tdCursor))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_row.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });

      describe('when the last row is selected', () => {
        it('it should remove the middle row and move cursor to the first cell of the previous row', () => {
          const { plugin, pluginState, editorView, refs } = editor(
            doc(
              p('text'),
              table(tr(tdCursor), tr(td({})(p('{nextPos}'))), tr(tdEmpty)),
            ),
            trackEvent,
          );
          const { nextPos } = refs;
          plugin.props.handleDOMEvents!.focus(editorView, event);
          selectRow(2)(editorView.state, editorView.dispatch);
          pluginState.remove();
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(tdEmpty), tr(tdCursor))),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.table.delete_row.button',
          );
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
          editorView.destroy();
        });
      });
    });
  });

  describe('toggleHeaderRow()', () => {
    describe("when there's no header row yet", () => {
      it('it should convert first row to a header row', () => {
        // p('text') goes before table to ensure that conversion uses absolute position of cells relative to the document
        const { editorView } = editor(
          doc(p('text'), table(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderRow(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
        );
        editorView.destroy();
      });

      describe('when header column is enabled', () => {
        it('it should convert the rest of the cells from the first row to header cells', () => {
          const { editorView } = editor(
            doc(p('text'), table(tr(thCursor, tdEmpty), tr(thEmpty, tdEmpty))),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(thEmpty, thEmpty), tr(thEmpty, tdEmpty))),
          );
          editorView.destroy();
        });
      });

      describe('when number column is enabled', () => {
        it('it should empty the first cell, start numbering from 2nd row and convert first row to a header row', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
                tr(td()(p('3')), tdEmpty, tdEmpty),
              ),
            ),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(thEmpty, thEmpty, thEmpty),
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });

    describe('when header row is enabled', () => {
      it('it should convert first row to a normal row', () => {
        const { editorView } = editor(
          doc(p('text'), table(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderRow(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        editorView.destroy();
      });

      describe('when header column is enabled', () => {
        it('it should convert the rest of the cells from the first row to normal cells', () => {
          const { editorView } = editor(
            doc(p('text'), table(tr(thCursor, thEmpty), tr(thEmpty, tdEmpty))),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(thEmpty, tdEmpty), tr(thEmpty, tdEmpty))),
          );
          editorView.destroy();
        });
      });

      describe('when number column is enabled', () => {
        it('it should start numbering from 1st row and convert first row to a normal row', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(thEmpty, thEmpty, thEmpty),
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
              ),
            ),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
                tr(td()(p('3')), tdEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });

      describe('when number column and header column are enabled', () => {
        it('it should start numbering from 1st row and convert first row to a normal row, keeping 2nd cell of the 1st row as header', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(thEmpty, thEmpty, thEmpty),
                tr(td()(p('1')), thEmpty, tdEmpty),
                tr(td()(p('2')), thEmpty, tdEmpty),
              ),
            ),
          );
          toggleHeaderRow(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), thEmpty, tdEmpty),
                tr(td()(p('2')), thEmpty, tdEmpty),
                tr(td()(p('3')), thEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });
  });

  describe('toggleHeaderColumn()', () => {
    describe("when there's no header column yet", () => {
      it('it should convert first column to a header column', () => {
        // p('text') goes before table to ensure that conversion uses absolute position of cells relative to the document
        const { editorView } = editor(
          doc(p('text'), table(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleHeaderColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table(tr(thEmpty, tdEmpty), tr(thEmpty, tdEmpty))),
        );
        editorView.destroy();
      });

      describe('when header row is enabled', () => {
        it('it should convert the rest of the cells from the first column to header cells', () => {
          const { editorView } = editor(
            doc(p('text'), table(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(thEmpty, thEmpty), tr(thEmpty, tdEmpty))),
          );
          editorView.destroy();
        });
      });

      describe('when number column is enabled', () => {
        it('it should convert second column to a header column', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
              ),
            ),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), thEmpty, tdEmpty),
                tr(td()(p('2')), thEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });

    describe('when header column is enabled', () => {
      it('it should convert first column to a normal column', () => {
        const { editorView } = editor(
          doc(p('text'), table(tr(thEmpty, tdEmpty), tr(thEmpty, tdEmpty))),
        );
        toggleHeaderColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        editorView.destroy();
      });

      describe('when header row is enabled', () => {
        it('it should convert the rest of the cells from the first column to normal cells', () => {
          const { editorView } = editor(
            doc(p('text'), table(tr(thEmpty, thEmpty), tr(thEmpty, tdEmpty))),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('text'), table(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
          );
          editorView.destroy();
        });
      });

      describe('when number column is enabled', () => {
        it('it should convert second column to a normal column', () => {
          const { editorView } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), thEmpty, tdEmpty),
                tr(td()(p('2')), thEmpty, tdEmpty),
              ),
            ),
          );
          toggleHeaderColumn(editorView.state, editorView.dispatch);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });
  });

  describe('toggleNumberColumn()', () => {
    describe('when number column is disabled', () => {
      it('it should add number column before the first existing column', () => {
        const { editorView } = editor(
          doc(p('text'), table(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        toggleNumberColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            tableWithAttrs({ isNumberColumnEnabled: true })(
              tr(td()(p('1')), tdEmpty, tdEmpty),
              tr(td()(p('2')), tdEmpty, tdEmpty),
            ),
          ),
        );
        editorView.destroy();
      });
    });

    describe('when number column is enabled', () => {
      it('it should remove number column', () => {
        const { editorView } = editor(
          doc(
            p('text'),
            tableWithAttrs({ isNumberColumnEnabled: true })(
              tr(td()(p('1')), tdEmpty, tdEmpty),
              tr(td()(p('2')), tdEmpty, tdEmpty),
            ),
          ),
        );
        toggleNumberColumn(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text'), table(tr(tdEmpty, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        editorView.destroy();
      });

      describe('when adding a new row', () => {
        it('it should reset numbers', () => {
          const { editorView, plugin, pluginState } = editor(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
              ),
            ),
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          pluginState.insertRow(1);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              tableWithAttrs({ isNumberColumnEnabled: true })(
                tr(td()(p('1')), tdEmpty, tdEmpty),
                tr(td()(p('2')), tdEmpty, tdEmpty),
                tr(td()(p('3')), tdEmpty, tdEmpty),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });
  });

  describe('when the cells contains only an image', () => {
    it('should add a paragraph below when arrow down is pressed', () => {
      const { editorView } = editor(
        doc(
          table(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowDown');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
                p(''),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );
      editorView.destroy();
    });

    it('should add a paragraph above when arrow up is pressed', () => {
      const { editorView } = editor(
        doc(
          table(
            tr(
              td()(
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowUp');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table(
            tr(
              td()(
                p(''),
                mediaGroup(
                  media({
                    id: 'af9310df-fee5-459a-a968-99062ecbb756',
                    type: 'file',
                    collection: 'MediaServicesSample',
                    __fileMimeType: 'image/jpeg',
                  })(),
                ),
              ),
              tdEmpty,
              tdEmpty,
            ),
            tr(td()(p('2')), tdEmpty, tdEmpty),
          ),
        ),
      );
      editorView.destroy();
    });

    it('should not add a paragraph, if there already is a paragraph below when arrow down is pressed', () => {
      const docWithTable = doc(
        table(
          tr(
            td()(
              mediaGroup(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
              p('1'),
              p('2'),
            ),
            tdEmpty,
            tdEmpty,
          ),
          tr(td()(p('3')), tdEmpty, tdEmpty),
        ),
      );

      const { editorView } = editor(docWithTable);

      setNodeSelection(editorView, 4);
      sendKeyToPm(editorView, 'ArrowDown');

      expect(editorView.state.doc).toEqualDocument(docWithTable);
      editorView.destroy();
    });

    it('should not add a paragraph, if there already is a paragraph above when arrow up is pressed', () => {
      const docWithTable = doc(
        table(
          tr(
            td()(
              p('1'),
              p('2'),
              mediaGroup(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
            ),
            tdEmpty,
            tdEmpty,
          ),
          tr(td()(p('3')), tdEmpty, tdEmpty),
        ),
      );

      const { editorView } = editor(docWithTable);

      setNodeSelection(editorView, 6);
      sendKeyToPm(editorView, 'ArrowUp');

      expect(editorView.state.doc).toEqualDocument(docWithTable);
      editorView.destroy();
    });
  });

  describe('checkIfNumberColumnEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { plugin, editorView } = editor(
        doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(checkIfNumberColumnEnabled(editorView.state)).toBe(false);
      editorView.destroy();
    });
  });

  describe('checkIfHeaderColumnEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { plugin, editorView } = editor(
        doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(checkIfHeaderColumnEnabled(editorView.state)).toBe(false);
      editorView.destroy();
    });
  });

  describe('checkIfHeaderRowEnabled', () => {
    it('should return false if table is not in focus', () => {
      const { plugin, editorView } = editor(
        doc(table(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(checkIfHeaderRowEnabled(editorView.state)).toBe(false);
      editorView.destroy();
    });
  });
});
