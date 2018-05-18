import { mount } from 'enzyme';
import * as React from 'react';
import {
  TableState,
  stateKey,
} from '../../../../src/plugins/table/pm-plugins/main';
import RowControls from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls';
import {
  RowControlsButtonWrap,
  HeaderButton as RowControlsButton,
} from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls/styles';
import TableFloatingControls from '../../../../src/plugins/table/ui/TableFloatingControls';

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
  hoverRows,
  insertRow,
  resetHoverSelection,
} from '../../../../src/plugins/table/actions';

import AkButton from '@atlaskit/button';

import { tablesPlugin } from '../../../../src/plugins';
import { setTextSelection } from '../../../../src';
import { selectTable, getCellsInRow } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { CellSelection } from 'prosemirror-tables';
import DeleteRowButton from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls/DeleteRowButton';
import InsertRowButton from '../../../../src/plugins/table/ui/TableFloatingControls/RowControls/InsertRowButton';

const selectRows = rowIdxs => tr => {
  const cells: { pos: number; node: Node }[] = rowIdxs.reduce((acc, rowIdx) => {
    const rowCells = getCellsInRow(rowIdx)(tr.selection);
    return rowCells ? acc.concat(rowCells) : acc;
  }, []);

  if (cells) {
    const $anchor = tr.doc.resolve(cells[0].pos - 1);
    const $head = tr.doc.resolve(cells[cells.length - 1].pos - 1);
    return tr.setSelection(new CellSelection($anchor, $head));
  }
};

describe('RowControls', () => {
  const event = createEvent('event');
  const editor = (doc: any) =>
    createEditor<TableState>({
      doc,
      editorPlugins: [tablesPlugin],
      pluginKey: stateKey,
    });

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
            hoverRows={hoverRows}
            resetHoverSelection={resetHoverSelection}
          />,
        );
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(row);
        floatingControls.unmount();
      });
    });
  });

  [0, 1, 2].forEach(row => {
    describe(`when HeaderButton in row ${row + 1} is clicked`, () => {
      it('should not move the cursor when hovering controls', () => {
        const {
          plugin,
          editorView,
          pluginState: { tableElement },
          refs,
        } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p('{nextPos}')), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mount(
          <TableFloatingControls
            tableElement={tableElement}
            editorView={editorView}
            hoverRows={hoverRows}
            resetHoverSelection={resetHoverSelection}
          />,
        );

        plugin.props.handleDOMEvents!.focus(editorView, event);

        // move to header row
        const { nextPos } = refs;
        setTextSelection(editorView, nextPos);

        // now hover the row
        floatingControls
          .find(RowControlsButton)
          .at(row)
          .find('button')
          .first()
          .simulate('mouseover');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        // release the hover
        floatingControls
          .find(RowControlsButton)
          .at(row)
          .find('button')
          .first()
          .simulate('mouseout');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        floatingControls.unmount();
      });
    });

    describe('DeleteRowButton', () => {
      it(`renders a delete button with row ${row} selected`, () => {
        const {
          plugin,
          editorView,
          pluginState: { remove, tableElement },
        } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p()), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mount(
          <RowControls
            tableElement={tableElement!}
            editorView={editorView}
            hoverRows={hoverRows}
            resetHoverSelection={resetHoverSelection}
            isTableHovered={false}
            insertRow={insertRow}
            remove={remove}
            scroll={0}
            updateScroll={() => {}}
          />,
        );

        plugin.props.handleDOMEvents!.focus(editorView, event);

        // now click the row
        floatingControls
          .find(RowControlsButton)
          .at(row)
          .simulate('click');

        // reapply state to force re-render
        floatingControls.setState(floatingControls.state());

        // we should now have a delete button
        expect(floatingControls.find(DeleteRowButton).length).toBe(1);
        floatingControls.unmount();
      });
    });
  });

  describe('DeleteRowButton', () => {
    it('does not render a delete button with no selection', () => {
      const { plugin, editorView, pluginState: { tableElement } } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mount(
        <TableFloatingControls
          tableElement={tableElement}
          editorView={editorView}
          hoverRows={hoverRows}
        />,
      );

      plugin.props.handleDOMEvents!.focus(editorView, event);

      expect(floatingControls.find(DeleteRowButton).length).toBe(0);
      floatingControls.unmount();
    });
  });

  it('calls hoverRows when button hovered', () => {
    const { plugin, editorView, pluginState: { tableElement } } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const hoverRowsMock = jest.fn(hoverRows);

    const floatingControls = mount(
      <TableFloatingControls
        tableElement={tableElement}
        editorView={editorView}
        hoverRows={hoverRowsMock}
      />,
    );

    plugin.props.handleDOMEvents!.focus(editorView, event);

    editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

    // reapply state to force re-render
    floatingControls.setState(floatingControls.state());

    floatingControls.find(DeleteRowButton).simulate('mouseenter');

    // expect to want to apply the hover decoration on the rows, with danger
    expect(hoverRowsMock).toBeCalledWith([0, 1], true);

    floatingControls.unmount();
  });

  it('applies the danger class to the row buttons', () => {
    const {
      plugin,
      editorView,
      pluginState: { tableElement, remove },
    } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mount(
      <RowControls
        tableElement={tableElement!}
        editorView={editorView}
        hoverRows={hoverRows}
        resetHoverSelection={resetHoverSelection}
        isTableHovered={false}
        insertRow={insertRow}
        remove={remove}
        scroll={0}
        updateScroll={() => {}}
      />,
    );

    plugin.props.handleDOMEvents!.focus(editorView, event);

    editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

    // reapply state to force re-render
    floatingControls.setState(floatingControls.state());

    floatingControls.find(DeleteRowButton).simulate('mouseenter');

    floatingControls
      .find(RowControlsButtonWrap)
      .slice(0, 2)
      .forEach(buttonWrap => {
        expect(buttonWrap.hasClass('danger')).toBe(true);
      });

    floatingControls.unmount();
  });

  it('calls remove on clicking the remove button', () => {
    const { plugin, editorView, pluginState: { tableElement } } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const removeMock = jest.fn();

    const floatingControls = mount(
      <RowControls
        tableElement={tableElement!}
        editorView={editorView}
        hoverRows={hoverRows}
        resetHoverSelection={resetHoverSelection}
        isTableHovered={false}
        insertRow={insertRow}
        remove={removeMock}
        scroll={0}
        updateScroll={() => {}}
      />,
    );

    plugin.props.handleDOMEvents!.focus(editorView, event);

    editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

    // reapply state to force re-render
    floatingControls.setState(floatingControls.state());

    expect(floatingControls.find(DeleteRowButton).length).toBe(1);

    floatingControls
      .find(DeleteRowButton)
      .find(AkButton)
      .simulate('click');

    // ensure we called remove
    expect(removeMock).toBeCalled();

    floatingControls.unmount();
  });

  it('does not render a delete button with whole table selected', () => {
    const {
      plugin,
      editorView,
      pluginState: { tableElement, remove },
    } = editor(
      doc(
        table()(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mount(
      <RowControls
        tableElement={tableElement!}
        editorView={editorView}
        hoverRows={hoverRows}
        resetHoverSelection={resetHoverSelection}
        isTableHovered={false}
        insertRow={insertRow}
        remove={remove}
        scroll={0}
        updateScroll={() => {}}
      />,
    );

    plugin.props.handleDOMEvents!.focus(editorView, event);

    // select the whole table
    editorView.dispatch(selectTable(editorView.state.tr));

    // reapply state to force re-render
    floatingControls.setState(floatingControls.state());

    expect(floatingControls.find(DeleteRowButton).length).toBe(0);
    floatingControls.unmount();
  });

  describe('hides inner add buttons when selection spans multiple rows', () => {
    it('hides one when two rows are selected', () => {
      const {
        plugin,
        editorView,
        pluginState: { tableElement, remove },
      } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mount(
        <RowControls
          tableElement={tableElement!}
          editorView={editorView}
          hoverRows={hoverRows}
          resetHoverSelection={resetHoverSelection}
          isTableHovered={false}
          insertRow={insertRow}
          remove={remove}
          scroll={0}
          updateScroll={() => {}}
        />,
      );

      plugin.props.handleDOMEvents!.focus(editorView, event);

      expect(floatingControls.find(InsertRowButton).length).toBe(3);

      editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

      // reapply state to force re-render
      floatingControls.setState(floatingControls.state());

      expect(floatingControls.find(InsertRowButton).length).toBe(2);

      floatingControls.unmount();
    });

    it('hides two when three rows are selected', () => {
      const {
        plugin,
        editorView,
        pluginState: { tableElement, remove },
      } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mount(
        <RowControls
          tableElement={tableElement!}
          editorView={editorView}
          hoverRows={hoverRows}
          resetHoverSelection={resetHoverSelection}
          isTableHovered={false}
          insertRow={insertRow}
          remove={remove}
          scroll={0}
          updateScroll={() => {}}
        />,
      );

      plugin.props.handleDOMEvents!.focus(editorView, event);

      expect(floatingControls.find(InsertRowButton).length).toBe(3);

      editorView.dispatch(selectRows([0, 1, 2])(editorView.state.tr));

      // reapply state to force re-render
      floatingControls.setState(floatingControls.state());

      expect(floatingControls.find(InsertRowButton).length).toBe(1);

      floatingControls.unmount();
    });

    it('only renders a single delete button over multiple row selections', () => {
      const {
        plugin,
        editorView,
        pluginState: { tableElement, remove },
      } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mount(
        <RowControls
          tableElement={tableElement!}
          editorView={editorView}
          hoverRows={hoverRows}
          resetHoverSelection={resetHoverSelection}
          isTableHovered={false}
          insertRow={insertRow}
          remove={remove}
          scroll={0}
          updateScroll={() => {}}
        />,
      );

      plugin.props.handleDOMEvents!.focus(editorView, event);

      editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

      // reapply state to force re-render
      floatingControls.setState(floatingControls.state());

      expect(floatingControls.find(DeleteRowButton).length).toBe(1);

      floatingControls.unmount();
    });
  });
});
