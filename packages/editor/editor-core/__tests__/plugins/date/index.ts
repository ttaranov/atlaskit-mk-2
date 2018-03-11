import { NodeSelection } from 'prosemirror-state';
import {
  createEditor,
  doc,
  p as paragraph,
  date,
} from '@atlaskit/editor-test-helpers';

import {
  selectElement,
  insertDate,
  openDatePicker,
} from '../../../src/editor/plugins/date/actions';
import { pluginKey } from '../../../src/editor/plugins/date/plugin';
import datePlugin from '../../../src/editor/plugins/date';

describe('date plugin', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [datePlugin],
    });
  };

  const attrs = { timestamp: '1515639075805' };

  describe('actions', () => {
    describe('selectElement', () => {
      it('should set "element" prop in plugin state to a DOM node', () => {
        const { editorView: view } = editor(
          doc(paragraph('hello', date(attrs))),
        );
        const element = document.createElement('span');
        document.body.appendChild(element);
        const result = selectElement(element)(view.state, view.dispatch);

        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.element).toEqual(element);
        expect(result).toBe(true);
        document.body.removeChild(element);
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
        expect(pluginState.element).toEqual(null);
      });
    });

    describe('openDatePicker', () => {
      it('should set "element" prop in plugin state to a DOM node and select the node', () => {
        const { editorView: view } = editor(doc(paragraph('hello{<>}')));
        openDatePicker(view.domAtPos.bind(view))(view.state, view.dispatch);
        const pluginState = pluginKey.getState(view.state);
        expect(pluginState.element).toBeTruthy();
        expect(view.state.selection instanceof NodeSelection).toEqual(true);
      });
    });
  });
});
