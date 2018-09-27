import {
  doc,
  createEditor,
  a,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';
import hyperlinkEditorPlugin from '../../../../plugins/hyperlink';

describe('hyperlink', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
    });

  it('should not show toolbar in message editor', () => {
    const props = { appearance: 'message' } as any;
    expect(hyperlinkEditorPlugin.contentComponent!(props)).toBe(null);
  });

  describe('link mark behaviour', () => {
    it('should not change the link text when typing text before a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}google'))),
      );
      insertText(editorView, 'www.', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('www.', a({ href: 'google.com' })('google'))),
      );
    });
    it('should not change the link text when typing after after a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('google{<>}'))),
      );
      insertText(editorView, '.com', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('google'), '.com')),
      );
    });
    it('should change the links text when typing inside a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('web{<>}site'))),
      );
      insertText(editorView, '-', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('web-site'))),
      );
    });
  });
});
