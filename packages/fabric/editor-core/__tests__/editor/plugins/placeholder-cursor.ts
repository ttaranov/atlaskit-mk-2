import createEditor from '../../_helpers/create-editor';
import fakeTextCursor from '../../../src/editor/plugins/fake-text-cursor';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../../../src/editor/actions';

describe('@atlaskit/editor-core/editor/ui/fake-text-cursor', () => {
  let editorActions: EditorActions;
  let editorView: EditorView;
  beforeEach(() => {
    const editor = createEditor([fakeTextCursor]);
    editorActions = new EditorActions();
    editorActions._privateRegisterEditor(editor.editorView);
    editorView = editor.editorView;
  });

  afterEach(() => {
    editorView.destroy();
  });

  describe('helpDialog.pmPlugins', () => {
    it('should return array of size 1', () => {
      expect(fakeTextCursor.pmPlugins!().length).toEqual(1);
    });
  });
});
