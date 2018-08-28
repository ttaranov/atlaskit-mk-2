import { pluginKey as tablePluginKey } from '../../../../plugins/table/pm-plugins/main';
import { supportsTableLayout } from '../../../../plugins/table/toolbar';
import {
  createEditor,
  doc,
  p,
  table,
  tr,
  td,
  th,
  bodiedExtension,
  bodiedExtensionData,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers';
import { TableLayout } from '@atlaskit/editor-common';
import tablesPlugin from '../../../../plugins/table';
import {
  PermittedLayoutsDescriptor,
  TablePluginState,
} from '../../../../plugins/table/types';
import layoutPlugin from '../../../../plugins/layout';
import extensionPlugin from '../../../../plugins/extension';

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

  describe('supportsTableLayout()', () => {
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

          expect(supportsTableLayout(editorView.state)(layout)).toBe(true);
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

          expect(supportsTableLayout(editorView.state)(layout)).toBe(false);
        });
        it('returns false if table is nested in Columns', () => {
          const { editorView } = editor(
            doc(
              layoutSection()(
                layoutColumn(
                  table()(
                    tr(th()(p('{<>}1')), th()(p('2'))),
                    tr(td()(p('3')), td()(p('4'))),
                  ),
                ),
                layoutColumn(p('text')),
              ),
            ),
          );
          expect(supportsTableLayout(editorView.state)(layout)).toBe(false);
        });
      });
    });
  });
});
