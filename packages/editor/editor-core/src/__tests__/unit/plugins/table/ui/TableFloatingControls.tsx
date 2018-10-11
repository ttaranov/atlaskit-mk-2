import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { DecorationSet } from 'prosemirror-view';

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
  pluginKey,
  getPluginState,
} from '../../../../../plugins/table/pm-plugins/main';
import { TablePluginState } from '../../../../../plugins/table/types';
import { hoverTable } from '../../../../../plugins/table/actions';
import TableFloatingControls from '../../../../../plugins/table/ui/TableFloatingControls';
import CornerControls from '../../../../../plugins/table/ui/TableFloatingControls/CornerControls';
import RowControls from '../../../../../plugins/table/ui/TableFloatingControls/RowControls';
import tablesPlugin from '../../../../../plugins/table';

describe('TableFloatingControls', () => {
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey: pluginKey,
    });

  describe('when tableRef is undefined', () => {
    it('should not render table header', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingControls = mount(
        <TableFloatingControls editorView={editorView} />,
      );
      expect(floatingControls.html()).toEqual(null);
      floatingControls.unmount();
    });
  });

  describe('when tableRef is defined', () => {
    it('should render CornerControls and RowControls', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingControls = shallow(
        <TableFloatingControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );
      floatingControls.setProps({
        tableElement: document.createElement('table'),
      });
      floatingControls.update();
      expect(floatingControls.find(CornerControls).length).toEqual(1);
      expect(floatingControls.find(RowControls).length).toEqual(1);
    });
  });

  describe('when delete icon is hovered', () => {
    it('should add a node decoration to table nodeView with class="danger"', () => {
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
      hoverTable(true)(editorView.state, editorView.dispatch);
      const {
        decorationSet,
      }: { decorationSet: DecorationSet } = getPluginState(editorView.state);
      const decoration = decorationSet.find()[0] as any;
      expect(decoration.type.attrs.class.indexOf('danger')).toBeGreaterThan(-1);
    });
  });
});
