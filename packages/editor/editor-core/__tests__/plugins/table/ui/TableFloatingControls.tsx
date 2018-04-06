import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { DecorationSet } from 'prosemirror-view';
import {
  TableState,
  stateKey,
} from '../../../../src/plugins/table/pm-plugins/main';
import TableFloatingControls from '../../../../src/plugins/table/ui/TableFloatingControls';
import CornerControls from '../../../../src/plugins/table/ui/TableFloatingControls/CornerControls';
import ColumnControls from '../../../../src/plugins/table/ui/TableFloatingControls/ColumnControls';
import RowControls from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls';
import {
  ColumnControlsButtonWrap,
  HeaderButton as ColumnControlsButton,
} from '../../../../src/plugins/table/ui/TableFloatingControls/ColumnControls/styles';
import { RowControlsButtonWrap } from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls/styles';

import {
  createEvent,
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
  td,
  thEmpty,
} from '@atlaskit/editor-test-helpers';
import {
  hoverColumn,
  insertColumn,
  resetHoverSelection,
} from '../../../../src/plugins/table/actions';
import tablesPlugin from '../../../../src/plugins/table';
import { setTextSelection } from '../../../../src';

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

  describe('ColumnControls', () => {
    [1, 2, 3].forEach(column => {
      describe(`when table has ${column} columns`, () => {
        it(`should render ${column} column header buttons`, () => {
          const nodes = [tdCursor];
          for (let i = 1; i < column; i++) {
            nodes.push(tdEmpty);
          }
          const { editorView, plugin, pluginState } = editor(
            doc(p('text'), table()(tr(...nodes))),
          );
          const floatingControls = mount(
            <ColumnControls
              isTableHovered={false}
              insertColumn={insertColumn}
              hoverColumn={hoverColumn}
              resetHoverSelection={resetHoverSelection}
              tableElement={pluginState.tableElement!}
              editorView={editorView}
            />,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          expect(floatingControls.find(ColumnControlsButtonWrap)).toHaveLength(
            column,
          );
          floatingControls.unmount();
        });
      });
    });

    [0, 1, 2].forEach(column => {
      describe(`when HeaderButton in column ${column + 1} is clicked`, () => {
        it('should not move the cursor when hovering controls', () => {
          const { plugin, editorView, pluginState, refs } = editor(
            doc(
              table()(
                tr(thEmpty, td({})(p('{nextPos}')), thEmpty),
                tr(tdCursor, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
          );

          const floatingControls = mount(
            <ColumnControls
              isTableHovered={false}
              insertColumn={insertColumn}
              hoverColumn={hoverColumn}
              resetHoverSelection={resetHoverSelection}
              tableElement={pluginState.tableElement!}
              editorView={editorView}
            />,
          );

          plugin.props.handleDOMEvents!.focus(editorView, event);

          // move to header row
          const { nextPos } = refs;
          setTextSelection(editorView, nextPos);

          // now hover the column
          floatingControls
            .find(ColumnControlsButton)
            .at(column)
            .find('button')
            .first()
            .simulate('mouseover');

          // assert the cursor is still in same position
          expect(editorView.state.selection.$from.pos).toBe(nextPos);
          expect(editorView.state.selection.$to.pos).toBe(nextPos);

          // release the hover
          floatingControls
            .find(ColumnControlsButton)
            .at(column)
            .find('button')
            .first()
            .simulate('mouseout');

          // assert the cursor is still in same position
          expect(editorView.state.selection.$from.pos).toBe(nextPos);
          expect(editorView.state.selection.$to.pos).toBe(nextPos);
        });
      });
    });
  });

  describe('RowControls', () => {
    [1, 2, 3].forEach(row => {
      describe(`when table has ${row} rows`, () => {
        it(`should render ${row} row header buttons`, () => {
          const rows = [tr(tdCursor)];
          for (let i = 1; i < row; i++) {
            rows.push(tr(tdEmpty));
          }
          const { editorView, plugin, pluginState: { tableElement } } = editor(
            doc(p('text'), table()(...rows)),
          );
          const floatingControls = mount(
            <TableFloatingControls
              tableElement={tableElement}
              editorView={editorView}
            />,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(
            row,
          );
          floatingControls.unmount();
        });
      });
    });
  });
});
