import { NodeSelection } from 'prosemirror-state';
import {
  createEditor,
  doc,
  p as paragraph,
  date,
} from '@atlaskit/editor-test-helpers';

import {
  setDatePickerAt,
  insertDate,
  openDatePicker,
  closeDatePicker,
} from '../../../../plugins/date/actions';
import { pluginKey } from '../../../../plugins/date/plugin';
import datePlugin from '../../../../plugins/date';

describe('date plugin', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [datePlugin],
    });
  };

  const attrs = { timestamp: '1515639075805' };

  describe('actions', () => {
    describe('setDatePickerAt', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello', date(attrs))),
        );

        const showDatePickerAt = view.state.selection.$from.pos;
        const result = setDatePickerAt(showDatePickerAt)(
          view.state,
          view.dispatch,
        );

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(showDatePickerAt);
        expect(result).toBe(true);
      });
    });

    describe('insertDate', () => {
      it('should insert date node to the document', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate()(view.state, view.dispatch);
        expect(view.state.selection.$from.nodeBefore!.type).toEqual(
          view.state.schema.nodes.date,
        );
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(null);
      });

      it('should insert UTC timestamp', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        insertDate({ year: 2018, month: 5, day: 1 })(view.state, view.dispatch);
        expect(view.state.selection.$from.nodeBefore!.type).toEqual(
          view.state.schema.nodes.date,
        );
        expect(view.state.selection.$from.nodeBefore!.attrs.timestamp).toEqual(
          Date.UTC(2018, 4, 1),
        );
        expect(
          view.state.selection.$from.nodeBefore!.attrs.timestamp,
        ).not.toEqual(new Date(2018, 5, 1));
      });

      it('should keep the same "showDatePickerAt" in collab mode', () => {
        const { editorView: view } = editor(doc(paragraph('world{<>}')));
        insertDate()(view.state, view.dispatch);
        openDatePicker(view.domAtPos.bind(view))(view.state, view.dispatch);

        const documentChangeTr = view.state.tr.insertText('hello ', 1);
        // Don't use dispatch to mimic collab provider
        view.updateState(view.state.apply(documentChangeTr));

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toEqual(12);
      });
    });

    describe('openDatePicker', () => {
      it('should set "showDatePickerAt" prop in plugin state to a DOM node and select the node', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        openDatePicker(view.domAtPos.bind(view))(view.state, view.dispatch);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });
    });

    describe('closeDatePicker', () => {
      it('should set "showDatePickerAt" prop to falsy and move selection to after the node', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        openDatePicker(view.domAtPos.bind(view))(view.state, view.dispatch);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.showDatePickerAt).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);

        closeDatePicker()(view.state, view.dispatch);
        const newPluginState = pluginKey.getState(view.state);
        expect(newPluginState.showDatePickerAt).toBeFalsy();
        expect(view.state.selection instanceof NodeSelection).toEqual(false);
        expect(view.state.selection.from).toEqual(6);
      });
    });
  });
});
