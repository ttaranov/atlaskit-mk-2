import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { DecorationSet } from 'prosemirror-view';
import tablePlugins, { TableState } from '../../src/plugins/table';
import TableFloatingControls from '../../src/ui/TableFloatingControls';
import CornerControls from '../../src/ui/TableFloatingControls/CornerControls';
import ColumnControls from '../../src/ui/TableFloatingControls/ColumnControls';
import RowControls from '../../src/ui/TableFloatingControls/RowControls';
import InsertColumnButton from '../../src/ui/TableFloatingControls/ColumnControls/InsertColumnButton';
import InsertRowButton from '../../src/ui/TableFloatingControls/RowControls/InsertRowButton';
import AkButton from '@atlaskit/button';
import {
  ColumnControlsButtonWrap,
  HeaderButton as ColumnControlsButton,
} from '../../src/ui/TableFloatingControls/ColumnControls/styles';
import {
  RowControlsButtonWrap,
  HeaderButton as RowControlsButton,
} from '../../src/ui/TableFloatingControls/RowControls/styles';

import {
  createEvent,
  doc,
  p,
  makeEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import {
  selectTable,
  selectColumn,
  hoverColumn,
  resetHoverSelection,
} from '../../src/editor/plugins/table/actions';
import {
  checkIfRowSelected,
  checkIfColumnSelected,
  checkIfTableSelected,
} from '../../src/editor/plugins/table/utils';

describe('TableFloatingControls', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    makeEditor<TableState>({
      doc,
      plugins: tablePlugins(),
    });

  describe('when tableElement is undefined', () => {
    it('should not render table header', () => {
      const { editorView } = editor(
        doc(p('text'), table(tr(tdEmpty, tdEmpty, tdEmpty))),
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
        doc(p('text'), table(tr(tdEmpty, tdEmpty, tdEmpty))),
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
        doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
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

  describe('CornerControls', () => {
    describe('when checkIfTableSelected is true', () => {
      it('should render selected header', () => {
        const { editorView, plugin, pluginState: { tableElement } } = editor(
          doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
        );
        const floatingControls = mount(
          <TableFloatingControls
            tableElement={tableElement}
            checkIfTableSelected={checkIfTableSelected}
            checkIfRowSelected={checkIfRowSelected}
            checkIfColumnSelected={checkIfColumnSelected}
            editorView={editorView}
          />,
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        selectTable(editorView.state, editorView.dispatch);
        expect(
          floatingControls.find(CornerControls).prop('checkIfSelected')(
            editorView.state,
          ),
        ).toBe(true);
        floatingControls.unmount();
      });
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
            doc(p('text'), table(tr(...nodes))),
          );
          const floatingControls = mount(
            <ColumnControls
              isTableHovered={false}
              checkIfSelected={checkIfColumnSelected}
              selectColumn={selectColumn}
              insertColumn={pluginState.insertColumn}
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
        it(`should call selectColumn(${column})`, () => {
          const { editorView, plugin, pluginState } = editor(
            doc(p('text'), table(tr(tdCursor, tdEmpty, tdEmpty))),
          );
          const spy = jest.fn();
          let calledWithArgs: Array<any>;
          spy.mockImplementation((...args) => {
            calledWithArgs = args;
          });
          const floatingControls = mount(
            <ColumnControls
              isTableHovered={false}
              checkIfSelected={checkIfColumnSelected}
              selectColumn={col => () => spy(col)}
              insertColumn={pluginState.insertColumn}
              hoverColumn={hoverColumn}
              resetHoverSelection={resetHoverSelection}
              tableElement={pluginState.tableElement!}
              editorView={editorView}
            />,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          floatingControls
            .find(ColumnControlsButton)
            .at(column)
            .find('button')
            .first()
            .simulate('mousedown');
          expect(spy).toHaveBeenCalledTimes(1);
          expect(calledWithArgs![0]).toEqual(column);
          floatingControls.unmount();
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
            doc(p('text'), table(...rows)),
          );
          const floatingControls = mount(
            <TableFloatingControls
              checkIfTableSelected={checkIfTableSelected}
              checkIfRowSelected={checkIfRowSelected}
              checkIfColumnSelected={checkIfColumnSelected}
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

    [0, 1, 2].forEach(row => {
      describe(`when HeaderButton in row ${row + 1} is clicked`, () => {
        it(`should call selectRow(${row})`, () => {
          const { editorView, plugin, pluginState: { tableElement } } = editor(
            doc(p('text'), table(tr(tdCursor), tr(tdEmpty), tr(tdEmpty))),
          );
          const spy = jest.fn();
          let calledWithArgs: Array<any>;
          spy.mockImplementation((...args) => {
            calledWithArgs = args;
          });
          const floatingControls = mount(
            <TableFloatingControls
              selectRow={row => () => spy(row)}
              checkIfTableSelected={checkIfTableSelected}
              checkIfRowSelected={checkIfRowSelected}
              checkIfColumnSelected={checkIfColumnSelected}
              tableElement={tableElement}
              editorView={editorView}
            />,
          );
          plugin.props.handleDOMEvents!.focus(editorView, event);
          floatingControls
            .find(RowControlsButton)
            .at(row)
            .find('button')
            .first()
            .simulate('click');
          expect(spy).toHaveBeenCalledTimes(1);
          expect(calledWithArgs![0]).toEqual(row);
          floatingControls.unmount();
        });
      });
    });
  });

  describe('InsertColumnButton', () => {
    [0, 1, 2].forEach(index => {
      describe(`when InsertColumnButton with index ${index} is clicked`, () => {
        it(`should call pluginState.insertColumn(${index})`, () => {
          const { pluginState } = editor(doc(p('text')));
          const insertColumnSpy = jest.spyOn(
            pluginState,
            'insertColumn',
          ) as any;
          let calledWithArgs: Array<any>;
          insertColumnSpy.mockImplementation((...args) => {
            calledWithArgs = args;
          });

          const wrapper = mount(
            <InsertColumnButton index={index} insertColumn={insertColumnSpy} />,
          );
          wrapper.setState({ hovered: true });
          wrapper.find(AkButton).simulate('click');
          expect(insertColumnSpy).toHaveBeenCalledTimes(1);
          expect(calledWithArgs![0]).toEqual(index);
          wrapper.unmount();
        });
      });
    });
  });

  describe('InsertRowButton', () => {
    [0, 1, 2].forEach(index => {
      describe(`when InsertRowButton with index ${index} is clicked`, () => {
        it(`should call pluginState.insertRow(${index})`, () => {
          const { pluginState } = editor(doc(p('text')));
          const insertRowSpy = jest.spyOn(pluginState, 'insertRow') as any;
          let calledWithArgs: Array<any>;
          insertRowSpy.mockImplementation((...args) => {
            calledWithArgs = args;
          });
          const wrapper = mount(
            <InsertRowButton index={index} insertRow={insertRowSpy} />,
          );
          wrapper.setState({ hovered: true });
          wrapper.find(AkButton).simulate('click');
          expect(insertRowSpy).toHaveBeenCalledTimes(1);
          expect(calledWithArgs![0]).toEqual(index);
          wrapper.unmount();
        });
      });
    });
  });
});
