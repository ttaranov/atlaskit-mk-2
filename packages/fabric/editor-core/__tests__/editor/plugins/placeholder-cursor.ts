import createEditor from '../../_helpers/create-editor';
import placeholderCursor from '../../../src/editor/plugins/placeholder-cursor';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../../../src/editor/actions';

describe('@atlaskit/editor-core/editor/ui/PlaceholderCursor', () => {
  let editorActions: EditorActions;
  let editorView: EditorView;
  beforeEach(() => {
    const editor = createEditor([placeholderCursor]);
    editorActions = new EditorActions();
    editorActions._privateRegisterEditor(editor.editorView);
    editorView = editor.editorView;
  });

  afterEach(() => {
    editorView.destroy();
  });

  describe('helpDialog.pmPlugins', () => {
    it('should return array of size 1', () => {
      expect(placeholderCursor.pmPlugins!().length).toEqual(1);
    });
  });
});
