import { EditorView, DecorationSet } from 'prosemirror-view';
import fakeTextCursor, {
  stateKey as fakeTextCursorStateKey,
  createPlugin as createFakeTextCursorPlugin,
} from '../../../../plugins/fake-text-cursor';
import {
  addFakeTextCursor,
  drawFakeTextCursor,
} from '../../../../plugins/fake-text-cursor/cursor';
import { createEditor } from '@atlaskit/editor-test-helpers';

describe('@atlaskit/editor-core/editor/ui/fake-text-cursor', () => {
  let editorView: EditorView;
  beforeEach(() => {
    const editor = createEditor({ editorPlugins: [fakeTextCursor] });
    editorView = editor.editorView;
  });

  describe('fakeTextCursor.pmPlugins', () => {
    it('should return array of size 1', () => {
      expect(fakeTextCursor.pmPlugins!().length).toEqual(1);
    });
  });

  describe('stateKey', () => {
    it('should be well defined', () => {
      expect(fakeTextCursorStateKey).toBeDefined();
    });
  });

  describe('plugin', () => {
    it('should have defined property decorations', () => {
      const plugin = createFakeTextCursorPlugin();
      expect(plugin.props.decorations).toBeDefined();
    });

    it('should add fake text-cursor', () => {
      addFakeTextCursor(editorView.state, editorView.dispatch);
      const decorators = drawFakeTextCursor(editorView.state);
      expect(decorators instanceof DecorationSet).toEqual(true);
    });
  });
});
