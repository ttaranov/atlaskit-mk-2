import { findTable } from 'prosemirror-utils';
import {
  createEditor,
  doc,
  p,
  table,
  tr,
  td,
  th,
  tdCursor,
  tdEmpty,
  bodiedExtension,
  bodiedExtensionData,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers';
import { TableLayout } from '@atlaskit/editor-common';
import {
  pluginKey as tablePluginKey,
  getPluginState,
} from '../../../../plugins/table/pm-plugins/main';
import tablesPlugin from '../../../../plugins/table';
import {
  PermittedLayoutsDescriptor,
  TablePluginState,
} from '../../../../plugins/table/types';
import layoutPlugin from '../../../../plugins/layout';
import extensionPlugin from '../../../../plugins/extension';
import { toggleTableLayout } from '../../../../plugins/table/actions';
import { isLayoutSupported } from '../../../../plugins/table/utils';

describe('table toolbar', () => {
  const editor = (
    doc: any,
    permittedLayouts: PermittedLayoutsDescriptor = 'all',
  ) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts,
    };
    return createEditor<TablePluginState>({
      doc,
      editorPlugins: [
        tablesPlugin(tableOptions),
        layoutPlugin,
        extensionPlugin,
      ],
      editorProps: {
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };

  describe('table layouts', () => {
    it('should update the table node layout attribute', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const nodeInitial = findTable(editorView.state.selection)!.node;
      expect(nodeInitial).toBeDefined();
      expect(nodeInitial!.attrs.layout).toBe('default');

      toggleTableLayout(editorView.state, editorView.dispatch);

      const { node } = findTable(editorView.state.selection)!;

      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('wide');

      editorView.destroy();
    });

    it('can set the data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      let tableElement = editorView.dom.querySelector('table');
      expect(tableElement!.getAttribute('data-layout')).toBe('default');

      toggleTableLayout(editorView.state, editorView.dispatch);
      tableElement = editorView.dom.querySelector('table');
      expect(tableElement!.getAttribute('data-layout')).toBe('wide');

      editorView.destroy();
    });

    it('applies the initial data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table({ layout: 'full-width' })(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const tables = editorView.dom.getElementsByTagName('table');
      expect(tables.length).toBe(1);
      const tableElement = tables[0];

      expect(tableElement.getAttribute('data-layout')).toBe('full-width');

      editorView.destroy();
    });

    ['default', 'wide', 'full-width'].forEach(currentLayout => {
      describe(`#toggleTableLayout`, () => {
        it('should toggle table layout attribute', () => {
          const { editorView } = editor(
            doc(
              table({ layout: currentLayout as TableLayout })(
                tr(tdCursor, tdEmpty, tdEmpty),
              ),
            ),
          );
          toggleTableLayout(editorView.state, editorView.dispatch);
          const { tableNode } = getPluginState(editorView.state);
          let nextLayout;
          switch (currentLayout) {
            case 'default':
              nextLayout = 'wide';
              break;
            case 'wide':
              nextLayout = 'full-width';
              break;
            case 'full-width':
              nextLayout = 'default';
              break;
          }
          expect(tableNode.attrs.layout).toBe(nextLayout);
          editorView.destroy();
        });
      });
    });

    it('applies the initial data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table({ layout: 'full-width' })(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const tables = editorView.dom.getElementsByTagName('table');
      expect(tables.length).toBe(1);
      const tableElement = tables[0];

      expect(tableElement.getAttribute('data-layout')).toBe('full-width');

      editorView.destroy();
    });
  });

  describe('#isLayoutSupported', () => {
    (['default', 'wide', 'full-width'] as TableLayout[]).forEach(layout => {
      describe(`when called with "${layout}"`, () => {
        it('returns true if permittedLayouts="all"', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(th()(p('{<>}1')), th()(p('2'))),
                tr(td()(p('3')), td()(p('4'))),
              ),
            ),
          );

          expect(isLayoutSupported(editorView.state)).toBe(true);
        });
        it('returns false if table is nested in bodiedExtension', () => {
          const { editorView } = editor(
            doc(
              bodiedExtension(bodiedExtensionData[0].attrs)(
                table()(
                  tr(th()(p('{<>}1')), th()(p('2'))),
                  tr(td()(p('3')), td()(p('4'))),
                ),
              ),
            ),
          );

          expect(isLayoutSupported(editorView.state)).toBe(false);
        });
        it('returns false if table is nested in Columns', () => {
          const { editorView } = editor(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(
                  table()(
                    tr(th()(p('{<>}1')), th()(p('2'))),
                    tr(td()(p('3')), td()(p('4'))),
                  ),
                ),
                layoutColumn({ width: 50 })(p('text')),
              ),
            ),
          );
          expect(isLayoutSupported(editorView.state)).toBe(false);
        });
      });
    });
  });
});
