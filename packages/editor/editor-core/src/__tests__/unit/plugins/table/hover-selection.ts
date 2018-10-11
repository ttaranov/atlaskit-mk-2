import { DecorationSet, EditorView } from 'prosemirror-view';
import {
  getCellsInColumn,
  getCellsInRow,
  getCellsInTable,
} from 'prosemirror-utils';
import {
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';

import {
  clearHoverSelection,
  hoverColumns,
  hoverRows,
  hoverTable,
} from '../../../../plugins/table/actions';
import {
  pluginKey,
  getPluginState,
} from '../../../../plugins/table/pm-plugins/main';
import { TablePluginState } from '../../../../plugins/table/types';
import tablesPlugin from '../../../../plugins/table';

describe('table hover selection plugin', () => {
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey,
    });

  const getTableDecorations = (editorView: EditorView, cells) => {
    const { decorationSet }: { decorationSet: DecorationSet } = getPluginState(
      editorView.state,
    );
    return decorationSet.find(cells[0].pos, cells[cells.length - 1].pos);
  };

  describe('hoverColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when called with ${column}`, () => {
          it(`should create a hover selection of ${column} column`, () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );

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
          const { editorView } = editor(
            doc(
              p('text'),
              table()(
                tr(tdCursor, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

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
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

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
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                ),
              ),
            );

            hoverRows([row])(editorView.state, editorView.dispatch);
            expect(
              getTableDecorations(
                editorView,
                getCellsInRow(row)(editorView.state.selection)!,
              ),
            ).toHaveLength(2);
          });

          it(`can apply the danger class to the decoration`, () => {
            const { editorView } = editor(
              doc(
                p('text'),
                table()(
                  tr(tdCursor, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                ),
              ),
            );

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
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

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
        const { editorView } = editor(
          doc(
            p('text'),
            table()(
              tr(tdCursor, tdEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );

        hoverTable()(editorView.state, editorView.dispatch);

        // selection should span all 6 cells
        expect(
          getTableDecorations(
            editorView,
            getCellsInTable(editorView.state.selection)!,
          ),
        ).toHaveLength(6);

        // reset hover selection plugin to an empty DecorationSet
        clearHoverSelection(editorView.state, editorView.dispatch);
        expect(getPluginState(editorView.state).decorationSet).toEqual(
          DecorationSet.empty,
        );
      });
    });
  });
});
