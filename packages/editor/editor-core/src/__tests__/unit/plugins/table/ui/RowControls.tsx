import * as React from 'react';
import { selectTable, getCellsInRow, selectRow } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { CellSelection } from 'prosemirror-tables';
import {
  doc,
  p,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
  td,
  thEmpty,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/main';
import {
  TablePluginState,
  TableCssClassName as ClassName,
} from '../../../../../plugins/table/types';
import RowControls from '../../../../../plugins/table/ui/TableFloatingControls/RowControls';
import TableFloatingControls from '../../../../../plugins/table/ui/TableFloatingControls';
import {
  hoverRows,
  insertRow,
  clearHoverSelection,
  deleteSelectedRows,
} from '../../../../../plugins/table/actions';
import { tablesPlugin } from '../../../../../plugins';
import { setTextSelection } from '../../../../../index';
import { getSelectionRect } from '../../../../../plugins/table/utils';

const RowControlsButtonWrap = `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`;
const DeleteRowButton = `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP}`;
const InsertRowButton = `.${ClassName.CONTROLS_INSERT_BUTTON_WRAP}`;

const selectRows = rowIdxs => tr => {
  const cells: { pos: number; start: number; node: Node }[] = rowIdxs.reduce(
    (acc, rowIdx) => {
      const rowCells = getCellsInRow(rowIdx)(tr.selection);
      return rowCells ? acc.concat(rowCells) : acc;
    },
    [],
  );

  if (cells) {
    const $anchor = tr.doc.resolve(cells[0].pos);
    const $head = tr.doc.resolve(cells[cells.length - 1].pos);
    return tr.setSelection(new CellSelection($anchor, $head));
  }
};

describe('RowControls', () => {
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey,
    });

  [1, 2, 3].forEach(row => {
    describe(`when table has ${row} rows`, () => {
      it(`should render ${row} row header buttons`, () => {
        const rows = [tr(tdCursor)];
        for (let i = 1; i < row; i++) {
          rows.push(tr(tdEmpty));
        }
        const { editorView } = editor(doc(p('text'), table()(...rows)));
        const floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );
        expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(row);
        floatingControls.unmount();
        editorView.destroy();
      });
    });
  });

  [0, 1, 2].forEach(row => {
    describe(`when HeaderButton in row ${row + 1} is clicked`, () => {
      it('should not move the cursor when hovering controls', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p('{nextPos}')), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );

        // move to header row
        const { nextPos } = refs;
        setTextSelection(editorView, nextPos);

        // now hover the row
        floatingControls
          .find(RowControlsButtonWrap)
          .at(row)
          .find('button')
          .first()
          .simulate('mouseover');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        // release the hover
        floatingControls
          .find(RowControlsButtonWrap)
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
        const { editorView } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p('<>')), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mountWithIntl(
          <RowControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
            hoverRows={(rows, danger) => {
              hoverRows(rows, danger)(editorView.state, editorView.dispatch);
            }}
            clearHoverSelection={() => {
              clearHoverSelection(editorView.state, editorView.dispatch);
            }}
            isTableHovered={false}
            insertRow={row => {
              insertRow(row)(editorView.state, editorView.dispatch);
            }}
            selectRow={row => {
              editorView.dispatch(selectRow(row)(editorView.state.tr));
            }}
            deleteSelectedRows={() => {
              deleteSelectedRows(editorView.state, editorView.dispatch);
            }}
          />,
        );

        // now click the row
        floatingControls
          .find(RowControlsButtonWrap)
          .at(row)
          .find('button')
          .first()
          .simulate('mousedown');

        // selecting the row mutates the editor state (which is inside editorView)
        // we set tableHeight prop to trick shouldComponentUpdate and force re-render
        floatingControls.setProps({ tableHeight: 100 });

        // we should now have a delete button
        expect(floatingControls.find(DeleteRowButton).length).toBe(1);
        floatingControls.unmount();
      });
    });
  });

  describe('DeleteRowButton', () => {
    it('does not render a delete button with no selection', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mountWithIntl(
        <TableFloatingControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
        />,
      );

      expect(floatingControls.find(DeleteRowButton).length).toBe(0);
      floatingControls.unmount();
    });
  });

  it('applies the danger class to the row buttons', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mountWithIntl(
      <RowControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        hoverRows={(rows, danger) => {
          hoverRows(rows, danger)(editorView.state, editorView.dispatch);
        }}
        clearHoverSelection={() => {
          clearHoverSelection(editorView.state, editorView.dispatch);
        }}
        isTableHovered={false}
        insertRow={row => {
          insertRow(row)(editorView.state, editorView.dispatch);
        }}
        deleteSelectedRows={() => {
          deleteSelectedRows(editorView.state, editorView.dispatch);
        }}
        dangerRows={[0, 1]}
        selectRow={row => {
          editorView.dispatch(selectRow(row)(editorView.state.tr));
        }}
      />,
    );

    floatingControls
      .find(RowControlsButtonWrap)
      .slice(0, 2)
      .forEach(buttonWrap => {
        expect(buttonWrap.hasClass('danger')).toBe(true);
      });

    floatingControls.unmount();
  });

  it('calls remove on clicking the remove button', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const deleteSelectedRowsMock = jest.fn();

    const floatingControls = mountWithIntl(
      <RowControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        hoverRows={(rows, danger) => {
          hoverRows(rows, danger)(editorView.state, editorView.dispatch);
        }}
        clearHoverSelection={() => {
          clearHoverSelection(editorView.state, editorView.dispatch);
        }}
        isTableHovered={false}
        insertRow={row => {
          insertRow(row)(editorView.state, editorView.dispatch);
        }}
        deleteSelectedRows={deleteSelectedRowsMock}
        selectRow={row => {
          editorView.dispatch(selectRow(row)(editorView.state.tr));
        }}
      />,
    );

    editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

    // selecting the row mutates the editor state (which is inside editorView)
    // we set tableHeight prop to trick shouldComponentUpdate and force re-render
    floatingControls.setProps({ tableHeight: 100 });

    expect(floatingControls.find(DeleteRowButton).length).toBe(1);

    floatingControls
      .find(DeleteRowButton)
      .find('button')
      .simulate('mousedown');

    // ensure we called remove
    expect(deleteSelectedRowsMock).toBeCalled();

    floatingControls.unmount();
  });

  it('does not render a delete button with whole table selected', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mountWithIntl(
      <RowControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        hoverRows={(rows, danger) => {
          hoverRows(rows, danger)(editorView.state, editorView.dispatch);
        }}
        clearHoverSelection={() => {
          clearHoverSelection(editorView.state, editorView.dispatch);
        }}
        isTableHovered={false}
        insertRow={row => {
          insertRow(row)(editorView.state, editorView.dispatch);
        }}
        deleteSelectedRows={() => {
          deleteSelectedRows(editorView.state, editorView.dispatch);
        }}
        selectRow={row => {
          editorView.dispatch(selectRow(row)(editorView.state.tr));
        }}
      />,
    );

    // select the whole table
    editorView.dispatch(selectTable(editorView.state.tr));

    // selecting the row mutates the editor state (which is inside editorView)
    // we set tableHeight prop to trick shouldComponentUpdate and force re-render
    floatingControls.setProps({ tableHeight: 100 });

    expect(floatingControls.find(DeleteRowButton).length).toBe(0);
    floatingControls.unmount();
  });

  describe('hides inner add buttons when selection spans multiple rows', () => {
    it('hides one when two rows are selected', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mountWithIntl(
        <RowControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          clearHoverSelection={() => {
            clearHoverSelection(editorView.state, editorView.dispatch);
          }}
          isTableHovered={false}
          insertRow={row => {
            insertRow(row)(editorView.state, editorView.dispatch);
          }}
          deleteSelectedRows={() => {
            deleteSelectedRows(editorView.state, editorView.dispatch);
          }}
          selectRow={row => {
            editorView.dispatch(selectRow(row)(editorView.state.tr));
          }}
        />,
      );

      expect(floatingControls.find(InsertRowButton).length).toBe(3);

      editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

      // selecting the row mutates the editor state (which is inside editorView)
      // we set tableHeight prop to trick shouldComponentUpdate and force re-render
      floatingControls.setProps({ tableHeight: 100 });

      expect(floatingControls.find(InsertRowButton).length).toBe(2);

      floatingControls.unmount();
    });

    it('hides two when three rows are selected', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mountWithIntl(
        <RowControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          clearHoverSelection={() => {
            clearHoverSelection(editorView.state, editorView.dispatch);
          }}
          isTableHovered={false}
          insertRow={row => {
            insertRow(row)(editorView.state, editorView.dispatch);
          }}
          deleteSelectedRows={() => {
            deleteSelectedRows(editorView.state, editorView.dispatch);
          }}
          selectRow={row => {
            editorView.dispatch(selectRow(row)(editorView.state.tr));
          }}
        />,
      );

      expect(floatingControls.find(InsertRowButton).length).toBe(3);

      editorView.dispatch(selectRows([0, 1, 2])(editorView.state.tr));

      // selecting the row mutates the editor state (which is inside editorView)
      // we set tableHeight prop to trick shouldComponentUpdate and force re-render
      floatingControls.setProps({ tableHeight: 100 });

      expect(floatingControls.find(InsertRowButton).length).toBe(1);

      floatingControls.unmount();
    });

    it('only renders a single delete button over multiple row selections', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, td({})(p()), thEmpty),
            tr(tdCursor, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const floatingControls = mountWithIntl(
        <RowControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          clearHoverSelection={() => {
            clearHoverSelection(editorView.state, editorView.dispatch);
          }}
          isTableHovered={false}
          insertRow={row => {
            insertRow(row)(editorView.state, editorView.dispatch);
          }}
          deleteSelectedRows={() => {
            deleteSelectedRows(editorView.state, editorView.dispatch);
          }}
          selectRow={row => {
            editorView.dispatch(selectRow(row)(editorView.state.tr));
          }}
        />,
      );

      editorView.dispatch(selectRows([0, 1])(editorView.state.tr));

      // selecting the row mutates the editor state (which is inside editorView)
      // we set tableHeight prop to trick shouldComponentUpdate and force re-render
      floatingControls.setProps({ tableHeight: 100 });

      expect(floatingControls.find(DeleteRowButton).length).toBe(1);

      floatingControls.unmount();
    });
  });

  describe('rows shift selection', () => {
    const createEvent = (target: Element) => ({
      stopPropagation: () => {},
      preventDefault: () => {},
      shiftKey: true,
      target,
    });

    it('should shift select rows below the currently selected row', () => {
      const { editorView, plugin } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView.dispatch(selectRows([0])(editorView.state.tr));
      const target = document.querySelectorAll(
        `.${ClassName.ROW_CONTROLS} .${ClassName.CONTROLS_BUTTON}`,
      )[2];

      plugin.props.handleDOMEvents.mousedown(editorView, createEvent(target));
      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });

    it('should shift select rows above the currently selected row', () => {
      const { editorView, plugin } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      editorView.dispatch(selectRows([2])(editorView.state.tr));
      const target = document.querySelectorAll(
        `.${ClassName.ROW_CONTROLS} .${ClassName.CONTROLS_BUTTON}`,
      )[0];

      plugin.props.handleDOMEvents.mousedown(editorView, createEvent(target));
      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });
  });
});
