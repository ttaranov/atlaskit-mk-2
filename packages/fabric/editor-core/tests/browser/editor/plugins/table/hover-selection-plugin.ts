import { expect } from 'chai';
import {
  createEvent,
  chaiPlugin,
  doc,
  p,
  makeEditor,
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
} from '../../../../../src/editor/plugins/table/actions';
import { tableStartPos } from '../../../../../src/editor/plugins/table/utils';
import hoverSelectionPlugin, {
  pluginKey as hoverPluginKey,
} from '../../../../../src/editor/plugins/table/hover-selection-plugin';
import tablePlugins, { TableState } from '../../../../../src/plugins/table';
import {
  getColumnPos,
  getRowPos,
  getTablePos,
} from '../../../../../src/plugins/table/utils';

chai.use(chaiPlugin);

describe('table hover selection plugin', () => {
  const event = createEvent('event');

  const editor = (doc: any) =>
    makeEditor<TableState>({
      doc,
      plugins: [...tablePlugins(), hoverSelectionPlugin],
    });

  describe('hoverColumn(number)', () => {
    describe('when table has 3 columns', () => {
      [0, 1, 2].forEach(column => {
        describe(`when called with ${column}`, () => {
          it(`it should create a hover selection of ${column} column`, () => {
            const { plugin, pluginState, editorView } = editor(
              doc(
                p('text'),
                table(
                  tr(tdCursor, tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
            plugin.props.onFocus!(editorView, event);
            hoverColumn(column, editorView.state, editorView.dispatch);
            const offset = tableStartPos(editorView.state);
            const { from, to } = getColumnPos(column, pluginState.tableNode!);
            const set = hoverPluginKey.getState(editorView.state);
            const deco = set.find(from + offset, to + offset);
            // selection spans 2 cells in the selected column (because we have 2 rows in the table)
            expect(deco).to.have.length(2);
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
            const { plugin, pluginState, editorView } = editor(
              doc(
                p('text'),
                table(
                  tr(tdCursor, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                  tr(tdEmpty, tdEmpty),
                ),
              ),
            );
            plugin.props.onFocus!(editorView, event);
            hoverRow(row, editorView.state, editorView.dispatch);
            const offset = tableStartPos(editorView.state);
            const { from, to } = getRowPos(row, pluginState.tableNode!);
            const set = hoverPluginKey.getState(editorView.state);
            const deco = set.find(from + offset, to + offset);
            // selection spans 2 cells in the selected row
            expect(deco).to.have.length(2);
          });
        });
      });
    });
  });

  describe('hoverTable()', () => {
    describe('when table has 3 rows', () => {
      it('it should create a hover selection of the whole table', () => {
        const { plugin, pluginState, editorView } = editor(
          doc(
            p('text'),
            table(
              tr(tdCursor, tdEmpty),
              tr(tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty),
            ),
          ),
        );
        plugin.props.onFocus!(editorView, event);
        hoverTable(editorView.state, editorView.dispatch);
        const offset = tableStartPos(editorView.state);
        const { from, to } = getTablePos(pluginState.tableNode!);
        const set = hoverPluginKey.getState(editorView.state);
        const deco = set.find(from + offset, to + offset);
        // selection spans all 6 cells
        expect(deco).to.have.length(6);

        // reset hover selection plugin to an empty DecorationSet
        resetHoverSelection(editorView.state, editorView.dispatch);
        expect(hoverPluginKey.getState(editorView.state)).to.equal(
          DecorationSet.empty,
        );
      });
    });
  });
});
