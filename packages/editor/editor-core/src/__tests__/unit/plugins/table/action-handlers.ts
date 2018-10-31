import { DecorationSet, Decoration } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import {
  doc,
  createEditor,
  table,
  tr,
  tdEmpty,
  tdCursor,
} from '@atlaskit/editor-test-helpers';
import {
  pluginKey,
  defaultTableSelection,
} from '../../../../plugins/table/pm-plugins/main';
import {
  TablePluginState,
  TableCssClassName as ClassName,
} from '../../../../plugins/table/types';
import tablesPlugin from '../../../../plugins/table';
import {
  handleSetFocus,
  handleSetTableRef,
  handleSetTargetCellPosition,
  handleClearSelection,
  handleHoverColumns,
  handleHoverRows,
  handleHoverTable,
  handleDocOrSelectionChanged,
  handleToggleContextualMenu,
  handleShowInsertColumnButton,
  handleShowInsertRowButton,
  handleHideInsertColumnOrRowButton,
} from '../../../../plugins/table/action-handlers';
import { TableDecorations } from '../../../../plugins/table/types';

describe('table action handlers', () => {
  const editor = (doc: any) =>
    createEditor<TablePluginState>({
      doc,
      editorPlugins: [tablesPlugin()],
      pluginKey,
    });

  const dispatch = () => {};
  const defaultPluginState = {
    ...defaultTableSelection,
    decorationSet: DecorationSet.empty,
    pluginConfig: {},
    editorHasFocus: true,
  };
  const getHoverDecoration = () =>
    Decoration.node(
      2,
      6,
      { class: ClassName.HOVERED_CELL },
      { key: TableDecorations.CONTROLS_HOVER },
    );

  describe('#handleSetFocus', () => {
    it('should return a new state with updated editorHasFocus prop', () => {
      const pluginState = {
        ...defaultPluginState,
        editorHasFocus: false,
      };
      const newState = handleSetFocus(true)(pluginState, dispatch);
      expect(newState).toEqual({ ...pluginState, editorHasFocus: true });
    });
  });
  describe('#handleSetTableRef', () => {
    it('should return a new state with updated tableRef and tableNode props', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const pluginState = {
        ...defaultPluginState,
      };
      const tableRef = editorView.dom.querySelector('table') as HTMLElement;
      const newState = handleSetTableRef(editorView.state, tableRef)(
        pluginState,
        dispatch,
      );
      expect(newState).toEqual({
        ...pluginState,
        tableRef,
        tableFloatingToolbarTarget: editorView.dom.querySelector(
          `.${ClassName.TABLE_NODE_WRAPPER}`,
        ) as HTMLElement,
        tableNode: editorView.state.doc.firstChild,
      });
    });
  });
  describe('#handleSetTargetCellPosition', () => {
    it('should return a new state with updated targetCellPosition and isContextualMenuOpen props', () => {
      const pluginState = {
        ...defaultPluginState,
        isContextualMenuOpen: true,
      };
      const targetCellPosition = 100;
      const newState = handleSetTargetCellPosition(targetCellPosition)(
        pluginState,
        dispatch,
      );
      expect(newState).toEqual({
        ...pluginState,
        targetCellPosition,
        isContextualMenuOpen: false,
      });
    });
  });
  describe('#handleClearSelection', () => {
    it('should return a new state with default table selection', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const pluginState = {
        ...defaultPluginState,
        decorationSet: DecorationSet.create(editorView.state.doc, [
          getHoverDecoration(),
        ]),
        dangerColumns: [1, 2, 3],
        dangerRows: [1, 2, 3],
        isTableInDanger: true,
        isTableHovered: true,
      };
      const newState = handleClearSelection(pluginState, dispatch);
      expect(newState).toEqual({
        ...pluginState,
        ...defaultTableSelection,
        decorationSet: DecorationSet.empty,
      });
    });
  });
  describe('#handleHoverColumns', () => {
    it('should return a new state with updated dangerColumns and decorationSet props', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
      const pluginState = {
        ...defaultPluginState,
      };
      const dangerColumns = [0];
      const newState = handleHoverColumns(
        editorView.state,
        [getHoverDecoration()],
        dangerColumns,
      )(pluginState, dispatch);
      expect(newState).toEqual({
        ...pluginState,
        isTableInDanger: false,
        decorationSet: DecorationSet.create(editorView.state.doc, [
          getHoverDecoration(),
        ]),
        dangerColumns,
      });
    });
    describe('when dangerColumns === total number of columns', () => {
      it('should return a new state with isTableInDanger = true', () => {
        const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));
        const pluginState = {
          ...defaultPluginState,
        };
        const hoverDecoration: Decoration[] = [];
        const dangerColumns = [0, 1];
        const newState = handleHoverColumns(
          editorView.state,
          hoverDecoration,
          dangerColumns,
        )(pluginState, dispatch);
        expect(newState).toEqual({
          ...pluginState,
          isTableInDanger: true,
          decorationSet: DecorationSet.empty,
          dangerColumns,
        });
      });
    });
  });
  describe('#handleHoverRows', () => {
    it('should return a new state with updated dangerRows and hoverDecoration props', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const pluginState = {
        ...defaultPluginState,
      };
      const dangerRows = [0];
      const newState = handleHoverRows(
        editorView.state,
        [getHoverDecoration()],
        dangerRows,
      )(pluginState, dispatch);
      expect(newState).toEqual({
        ...pluginState,
        isTableInDanger: false,
        decorationSet: DecorationSet.create(editorView.state.doc, [
          getHoverDecoration(),
        ]),
        dangerRows,
      });
    });
    describe('when dangerRows === total number of columns', () => {
      it('should return a new state with isTableInDanger = true', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const pluginState = {
          ...defaultPluginState,
        };
        const hoverDecoration: Decoration[] = [];
        const dangerRows = [0, 1];
        const newState = handleHoverRows(
          editorView.state,
          hoverDecoration,
          dangerRows,
        )(pluginState, dispatch);
        expect(newState).toEqual({
          ...pluginState,
          isTableInDanger: true,
          decorationSet: DecorationSet.empty,
          dangerRows,
        });
      });
    });
  });
  describe('#handleHoverTable', () => {
    it('should return a new state with updated isTableInDanger and hoverDecoration props', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const pluginState = {
        ...defaultPluginState,
      };

      const newState = handleHoverTable(
        editorView.state,
        [getHoverDecoration()],
        true,
      )(pluginState, dispatch);
      expect(newState).toEqual({
        ...pluginState,
        decorationSet: DecorationSet.create(editorView.state.doc, [
          getHoverDecoration(),
        ]),
        isTableInDanger: true,
        isTableHovered: true,
      });
    });
  });
  describe('#handleToggleContextualMenu', () => {
    describe('when isContextualMenuOpen === false', () => {
      it('should return a new state with isContextualMenuOpen = true', () => {
        const pluginState = {
          ...defaultPluginState,
          isContextualMenuOpen: false,
        };
        const newState = handleToggleContextualMenu(pluginState, dispatch);
        expect(newState).toEqual({
          ...pluginState,
          isContextualMenuOpen: true,
        });
      });
    });
    describe('when isContextualMenuOpen === true', () => {
      it('should return a new state with isContextualMenuOpen = false', () => {
        const pluginState = {
          ...defaultPluginState,
          isContextualMenuOpen: true,
        };
        const newState = handleToggleContextualMenu(pluginState, dispatch);
        expect(newState).toEqual({
          ...pluginState,
          isContextualMenuOpen: false,
        });
      });
    });
  });
  describe('#handleDocOrSelectionChanged', () => {
    it('should return a new state with updated tableNode prop and reset selection', () => {
      const pluginState = {
        ...defaultPluginState,
        dangerColumns: [1, 2, 3],
        dangerRows: [1, 2, 3],
        isTableInDanger: true,
        isTableHovered: true,
        tableNode: undefined,
        targetCellPosition: undefined,
      };
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
      const { state } = editorView;
      const cursorPos = 8;
      editorView.dispatch(
        state.tr.setSelection(new TextSelection(state.doc.resolve(cursorPos))),
      );
      const newState = handleDocOrSelectionChanged(editorView.state.tr)(
        pluginState,
        dispatch,
      );
      expect(newState).toEqual({
        ...pluginState,
        ...defaultTableSelection,
        tableNode: editorView.state.doc.firstChild,
        targetCellPosition: cursorPos - 2,
      });
    });
  });
  describe('#handleShowInsertColumnButton', () => {
    it('should return a new state with updated insertColumnButtonIndex', () => {
      const pluginState = {
        ...defaultPluginState,
      };
      const insertColumnButtonIndex = 0;
      const newState = handleShowInsertColumnButton(insertColumnButtonIndex)(
        pluginState,
        dispatch,
      );

      expect(newState).toEqual({
        ...pluginState,
        insertColumnButtonIndex,
      });
    });
  });
  describe('#handleShowInsertRowButton', () => {
    it('should return a new state with updated insertRowButtonIndex', () => {
      const pluginState = {
        ...defaultPluginState,
      };
      const insertRowButtonIndex = 0;
      const newState = handleShowInsertRowButton(insertRowButtonIndex)(
        pluginState,
        dispatch,
      );

      expect(newState).toEqual({
        ...pluginState,
        insertRowButtonIndex,
      });
    });
  });
  describe('#handleHideInsertColumnOrRowButton', () => {
    it('should return a new state with insertColumnButtonIndex and insertRowButtonIndex set to undefined', () => {
      const pluginState = {
        ...defaultPluginState,
        insertColumnButtonIndex: 1,
        insertRowButtonIndex: 1,
      };
      const newState = handleHideInsertColumnOrRowButton(pluginState, dispatch);
      expect(newState).toEqual({
        ...pluginState,
        insertColumnButtonIndex: undefined,
        insertRowButtonIndex: undefined,
      });
    });
  });
});
