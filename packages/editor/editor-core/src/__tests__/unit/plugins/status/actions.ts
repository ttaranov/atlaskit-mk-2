import { createEditor, doc, p, status } from '@atlaskit/editor-test-helpers';
import statusPlugin from '../../../../plugins/status';
import { pluginKey } from '../../../../plugins/status/plugin';
import {
  insertStatus,
  setStatusPickerAt,
  closeStatusPicker,
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

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });
  });

  describe('closeStatusPicker', () => {
    it('should set showStatusPickerAt meta to null', () => {
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

      closeStatusPicker()(editorView);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(null);
    });

    it('should set focus on editor', () => {
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
      const focusSpy = jest.spyOn(editorView, 'focus');

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      insertStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      closeStatusPicker()(editorView);

      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
