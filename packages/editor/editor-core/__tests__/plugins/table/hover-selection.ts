import {
  createEvent,
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import { DecorationSet, EditorView } from 'prosemirror-view';
import {
  resetHoverSelection,
  hoverColumns,
  hoverRows,
  hoverTable,
} from '../../../src/plugins/table/actions';
import {
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
} from 'prosemirror-utils';
import { pluginKey as hoverPluginKey } from '../../../src/plugins/table/pm-plugins/hover-selection-plugin';
import {
  TableState,
  stateKey as tablePluginKey,
} from '../../../src/plugins/table/pm-plugins/main';
import tablesPlugin from '../../../src/plugins/table';

describe('table hover selection plugin', () => {
  const event = createEvent('event');

  const editor = (doc: any) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin],
      pluginKey: tablePluginKey,
    });

  const getTableDecorations = (editorView: EditorView, cells) => {
    const {
      decorationSet,
    }: { decorationSet: DecorationSet } = hoverPluginKey.getState(
      editorView.state,
    );
    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe('hoverColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when called with ${column}`, () => {
          it(`should create a hover selection of ${column} column`, () => {
            const { plugin, editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
            plugin.props.handleDOMEvents!.focus(editorView, event);
            hoverColumns([column])(editorView.state, editorView.dispatch);
            const decos = getTableDecorations(
              editorView,
              getCellsInColumn(column)(editorView.state.selection)!,
            );

            // selection spans 2 cells in the selected column (because we have 2 rows in the table)
            expect(decos).toHaveLength(2);
          });
        });

        it(`can apply the danger class to the decoration`, () => {
          const { plugin, editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(tdCursor, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          hoverColumns([column], true)(editorView.state, editorView.dispatch);

          const decos = getTableDecorations(
            editorView,
            getCellsInColumn(column)(editorView.state.selection)!,
          );

          expect(decos).toHaveLength(2);
          decos.forEach(deco => {
            // @ts-ignore
            expect(deco.type.attrs.class.split(' ')).toContain('danger');
          });
        });
      });
    });

    describe('can create a hover selection over multiple columns', () => {
      const { plugin, editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      hoverColumns([0, 1])(editorView.state, editorView.dispatch);
      const cells = getCellsInColumn(0)(editorView.state.selection)!.concat(
        getCellsInColumn(1)(editorView.state.selection)!,
      );

      expect(getTableDecorations(editorView, cells)).toHaveLength(4);
    });
  });

  describe('hoverRow(number)', () => {
    describe('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        describe(`when called with ${row}`, () => {
          it(`should create a hover selection of ${row} row`, () => {
            const { plugin, editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                ),
              ),
            );
            plugin.props.handleDOMEvents!.focus(editorView, event);
            hoverRows([row])(editorView.state, editorView.dispatch);
            expect(
              getTableDecorations(
                editorView,
                getCellsInRow(row)(editorView.state.selection)!,
              ),
            ).toHaveLength(2);
          });

          it(`can apply the danger class to the decoration`, () => {
            const { plugin, editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                ),
              ),
            );
            plugin.props.handleDOMEvents!.focus(editorView, event);
            hoverRows([row], true)(editorView.state, editorView.dispatch);
            const cells = getCellsInRow(row)(editorView.state.selection)!;
            const decos = getTableDecorations(editorView, cells);

            expect(decos).toHaveLength(2);
            decos.forEach(deco => {
              // @ts-ignore
              expect(deco.type.attrs.class.split(' ')).toContain('danger');
            });
          });
        });
      });
    });

    describe('can create a hover selection over multiple rows', () => {
      const { plugin, editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      hoverRows([0, 1])(editorView.state, editorView.dispatch);
      const cells = getCellsInRow(0)(editorView.state.selection)!.concat(
        getCellsInRow(1)(editorView.state.selection)!,
      );

      expect(getTableDecorations(editorView, cells)).toHaveLength(6);
    });
  });

  describe('hovertable()', () => {
    describe('when table has 3 rows', () => {
      it('should create a hover selection of the whole table', () => {
        const { plugin, editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdCursor, tdEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        hoverTable()(editorView.state, editorView.dispatch);

        // selection should span all 6 cells
        expect(
          getTableDecorations(
            editorView,
            getCellsInTable(editorView.state.selection)!,
          ),
        ).toHaveLength(6);

        // reset hover selection plugin to an empty DecorationSet
        resetHoverSelection(editorView.state, editorView.dispatch);
        expect(hoverPluginKey.getState(editorView.state).decorationSet).toEqual(
          DecorationSet.empty,
        );
      });
    });
  });
});
