import * as React from 'react';
import {
  doc,
  createEditor,
  table,
  tr,
  tdEmpty,
  thEmpty,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';

import { pluginKey } from '../../../../../plugins/table/pm-plugins/main';
import { TablePluginState } from '../../../../../plugins/table/types';
import CornerControls from '../../../../../plugins/table/ui/TableFloatingControls/CornerControls';
import { tablesPlugin } from '../../../../../plugins';
import InsertButton from '../../../../../plugins/table/ui/TableFloatingControls/InsertButton';

describe('CornerControls', () => {
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey,
    });

  describe('when table has number column enabled', () => {
    it('should render insert column and insert row buttons', () => {
      const { editorView } = editor(
        doc(
          table({ isNumberColumnEnabled: true })(
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const controls = mountWithIntl(
        <CornerControls
          editorView={editorView}
          clearHoverSelection={() => {}}
        />,
      );

      expect(controls.find(InsertButton)).toHaveLength(2);
      controls.unmount();
      editorView.destroy();
    });
  });

  describe('when table has header column enabled', () => {
    it('should not render insert column button', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, tdEmpty, tdEmpty), tr(thEmpty, tdEmpty, tdEmpty)),
        ),
      );

      const controls = mountWithIntl(
        <CornerControls
          editorView={editorView}
          clearHoverSelection={() => {}}
          isHeaderColumnEnabled={true}
        />,
      );

      expect(controls.find(InsertButton)).toHaveLength(1);
      expect(controls.find(InsertButton).prop('type')).toEqual('row');
      controls.unmount();
      editorView.destroy();
    });
  });

  describe('when table has header row enabled', () => {
    it('should not render insert row button', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, thEmpty, thEmpty), tr(tdEmpty, tdEmpty, tdEmpty)),
        ),
      );

      const controls = mountWithIntl(
        <CornerControls
          editorView={editorView}
          clearHoverSelection={() => {}}
          isHeaderRowEnabled={true}
        />,
      );

      expect(controls.find(InsertButton)).toHaveLength(1);
      expect(controls.find(InsertButton).prop('type')).toEqual('column');
      controls.unmount();
      editorView.destroy();
    });
  });
});
