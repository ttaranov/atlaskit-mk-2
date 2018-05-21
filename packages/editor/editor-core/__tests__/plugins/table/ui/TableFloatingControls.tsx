import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { DecorationSet } from 'prosemirror-view';
import {
  TableState,
  stateKey,
} from '../../../../src/plugins/table/pm-plugins/main';
import { pluginKey as hoverStateKey } from '../../../../src/plugins/table//pm-plugins/hover-selection-plugin';

import {
  hoverTable,
  clearHoverTable,
} from '../../../../src/plugins/table/actions';
import TableFloatingControls from '../../../../src/plugins/table/ui/TableFloatingControls';
import CornerControls from '../../../../src/plugins/table/ui/TableFloatingControls/CornerControls';
import RowControls from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls';

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

import tablesPlugin from '../../../../src/plugins/table';

describe('TableFloatingControls', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin],
      pluginKey: stateKey,
    });

  describe('when tableElement is undefined', () => {
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

  describe('when tableElement is defined', () => {
    it('should render CornerControls and RowControls', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const floatingControls = shallow(
        <TableFloatingControls editorView={editorView} />,
      );
      floatingControls.setProps({
        tableElement: document.createElement('table'),
      });
      floatingControls.update();
      expect(floatingControls.find(CornerControls).length).toEqual(1);
      expect(floatingControls.find(RowControls).length).toEqual(1);
    });
  });

  describe('when editor is focused', () => {
    it('should add a node decoration to table nodeView with class="with-controls"', () => {
      const { plugin, pluginState, editorView } = editor(
        doc(p('text'), table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      const decoration = pluginState.set.find()[0] as any;
      expect(
        decoration.type.attrs.class.indexOf('with-controls'),
      ).toBeGreaterThan(-1);
      plugin.props.handleDOMEvents!.blur(editorView, event);
      expect(pluginState.set).toEqual(DecorationSet.empty);
    });
  });

  describe('when delete icon is hovered', () => {
    it('should add a node decoration to table nodeView with class="danger"', () => {
      const { pluginState, editorView } = editor(
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
      }: { decorationSet: DecorationSet } = hoverStateKey.getState(
        editorView.state,
      );
      const decoration = decorationSet.find()[0] as any;
      expect(decoration.type.attrs.class.indexOf('danger')).toBeGreaterThan(-1);
      clearHoverTable(editorView.state, editorView.dispatch);
      expect(pluginState.set).toEqual(DecorationSet.empty);
    });
  });
});
