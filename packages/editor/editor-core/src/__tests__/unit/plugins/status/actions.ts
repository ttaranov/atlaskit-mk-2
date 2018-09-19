import { createEditor, doc, p, status } from '@atlaskit/editor-test-helpers';
import statusPlugin from '../../../../plugins/status';
import { pluginKey } from '../../../../plugins/status/plugin';
import {
  insertStatus,
  setStatusPickerAt,
} from '../../../../plugins/status/actions';

describe('status plugin: actions', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [statusPlugin],
    });
  };

  describe('insertStatus', () => {
    it('should update node at picker location if picker is shown', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
      const dispatchSpy = jest.spyOn(editorView, 'dispatch');

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      insertStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            '',
            status({
              color: 'green',
              text: 'Done',
              localId: '666',
            }),
          ),
        ),
      );

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });

    it('should keep picker open after updating status', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
      const dispatchSpy = jest.spyOn(editorView, 'dispatch');

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      insertStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });

    it('should keep move selection when updating status', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      insertStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toBeGreaterThan(selectionFrom);
    });

    it('should insert status if picker is not shown', () => {
      const { editorView } = editor(doc(p('')));

      insertStatus({
        color: 'blue',
        text: 'In progress',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            '',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
    });
  });

  describe('showStatusPickerAt', () => {
    it('should set showStatusPickerAt meta', () => {
      const { editorView } = editor(doc(p('Status: {<>}')));

      setStatusPickerAt(123)(editorView.state, editorView.dispatch);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(123);
    });
  });
});
