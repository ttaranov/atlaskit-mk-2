import {
  TablePluginState,
  stateKey as tablePluginKey,
} from '../../../src/plugins/table/pm-plugins/main';
import {
  doc,
  p,
  createEditor,
  table,
  tr,
  td,
  th,
  dispatchPasteEvent,
} from '@atlaskit/editor-test-helpers';
import tablesPlugin from '../../../src/plugins/table';

// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';

import { getCellsInTable, selectColumn } from 'prosemirror-utils';
import { CellSelection } from 'prosemirror-tables';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

const selectCell = (cell: {
  pos: number;
  start: number;
  node: ProsemirrorNode;
}) => tr => {
  const $anchor = tr.doc.resolve(cell.pos);
  return tr.setSelection(new CellSelection($anchor, $anchor));
};

describe('table plugin', () => {
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
        allowTables: {
          allowNumberColumn: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
          permittedLayouts: 'all',
        },
      },
      pluginKey: tablePluginKey,
    });

  describe('TableView', () => {
    describe('copy paste', () => {
      it('copies one cell onto another', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(th()(p('{<>}1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
          ),
        );

        let { state } = editorView;

        // select first cell
        const cells = getCellsInTable(state.selection);
        expect(cells![0].node.textContent).toEqual('1');
        state = state.apply(selectCell(cells![0])(state.tr));

        // copy it
        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // select the destination cell, which is 8
        const targetCell = cells![cells!.length - 2];
        expect(targetCell.node.textContent).toEqual('8');
        state = state.apply(selectCell(targetCell)(state.tr));

        // apply local state to view before paste
        editorView.updateState(state);

        // paste the first cell over the top of it
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table()(
              tr(th()(p('1')), th()(p('2')), th()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), th()(p('1')), td()(p('9'))),
            ),
          ),
        );
      });

      it('copies one column onto another', () => {
        const {
          editorView,
          refs: { nextPos },
        } = editor(
          doc(
            table()(
              tr(th()(p('{<>}1')), th()(p('2')), th()(p('3{nextPos}'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              tr(td()(p('7')), td()(p('8')), td()(p('9'))),
            ),
          ),
        );

        let { state } = editorView;

        // select second column
        state = state.apply(selectColumn(1)(state.tr));

        // copy it
        const { dom, text } = __serializeForClipboard(
          editorView,
          state.selection.content(),
        );

        // move cursor to the 3rd column
        const $pos = state.doc.resolve(nextPos);
        state = state.apply(
          state.tr.setSelection(new TextSelection($pos, $pos)),
        );

        // apply local state to view before paste
        editorView.updateState(state);

        // paste the column
        dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table()(
              tr(th()(p('1')), th()(p('2')), th()(p('2'))),
              tr(td()(p('4')), td()(p('5')), td()(p('5'))),
              tr(td()(p('7')), td()(p('8')), td()(p('8'))),
            ),
          ),
        );
      });
    });
  });
});
