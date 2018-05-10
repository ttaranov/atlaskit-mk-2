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
import { DecorationSet } from 'prosemirror-view';
import {
  resetHoverSelection,
  hoverColumn,
  hoverRow,
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

  describe('hoverColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when called with ${column}`, () => {
          it(`it should create a hover selection of ${column} column`, () => {
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
            hoverColumn(column)(editorView.state, editorView.dispatch);
            const cells = getCellsInColumn(column)(editorView.state.selection)!;
            const { decorationSet } = hoverPluginKey.getState(editorView.state);
            const deco = decorationSet.find(
              cells[0].pos,
              cells[cells.length - 1].pos,
            );
            // selection spans 2 cells in the selected column (because we have 2 rows in the table)
            expect(deco).toHaveLength(2);
          });
        });
      });
    });
  });

  describe('hoverRow(number)', () => {
    describe('when table has 3 rows', () => {
      [0, 1, 2].forEach(row => {
        describe(`when called with ${row}`, () => {
          it(`it should create a hover selection of ${row} row`, () => {
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
            hoverRow(row)(editorView.state, editorView.dispatch);
            const cells = getCellsInRow(row)(editorView.state.selection)!;
            const { decorationSet } = hoverPluginKey.getState(editorView.state);
            const deco = decorationSet.find(
              cells[0].pos,
              cells[cells.length - 1].pos,
            );
            // selection spans 2 cells in the selected row
            expect(deco).toHaveLength(2);
          });
        });
      });
    });
  });

  describe('hovertable()()', () => {
    describe('when table has 3 rows', () => {
      it('it should create a hover selection of the whole table', () => {
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
        hoverTable(editorView.state, editorView.dispatch);
        const cells = getCellsInTable(editorView.state.selection)!;
        const { decorationSet } = hoverPluginKey.getState(editorView.state);
        const deco = decorationSet.find(
          cells[0].pos,
          cells[cells.length - 1].pos,
        );
        // selection spans all 6 cells
        expect(deco).toHaveLength(6);

        // reset hover selection plugin to an empty DecorationSet
        resetHoverSelection(editorView.state, editorView.dispatch);
        expect(hoverPluginKey.getState(editorView.state).decorationSet).toEqual(
          DecorationSet.empty,
        );
      });
    });
  });
});
