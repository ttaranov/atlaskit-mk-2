import {
  createEditor,
  doc,
  p,
  a,
  insertText,
} from '@atlaskit/editor-test-helpers';

const editor = (doc, appearance?) =>
  createEditor({
    doc,
    editorProps: { appearance: appearance || 'message' },
  });

describe('hyperlink - sync-text-and-url', () => {
  describe('when href and display text are the same', () => {
    it('should update url when text is added inside link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('goo{<>}gle.com'))),
      );
      insertText(editorView, 'oo', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://goooogle.com' })('goooogle.com'))),
      );
    });

    it('should update url even when text is not url-like', () => {
      const { editorView } = editor(
        doc(p(a({ href: 'http://google.com' })('g{<}oogle.co{>}m'))),
      );
      editorView.dispatch(editorView.state.tr.insertText('oo'));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'goom' })('goom'))),
      );
    });

    it('should not update url when text is changed at left edge of link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('{<>}google.com'))),
      );
      insertText(editorView, 'www.', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('www.', a({ href: 'http://google.com' })('google.com'))),
      );
    });

    it('should not update url when text is changed at right edge of link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('google.com{<>}'))),
      );
      insertText(editorView, '.au', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('google.com'), '.au')),
      );
    });

    it('should not update url when text and url are the same', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('google.com{<>}'))),
      );
      const oldLink = editorView.state.doc.nodeAt(1);
      insertText(editorView, '.au', sel);
      expect(editorView.state.doc.nodeAt(1)).toBe(oldLink);
    });

    it('should not update url if url is deleted next to another link', () => {
      const { editorView } = editor(
        doc(
          p(
            a({ href: 'http://left.com' })('{<}left.com{>}'),
            a({ href: 'http://right.com' })('right.com'),
          ),
        ),
      );
      editorView.dispatch(editorView.state.tr.insertText('Left'));
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Left', a({ href: 'http://right.com' })('right.com'))),
      );
    });

    it('should handle multiple changes to different urls', () => {
      const {
        editorView,
        refs: { left, right },
      } = editor(
        doc(
          p(
            a({ href: 'http://left.com' })('left{left}.com'),
            a({ href: 'http://right.com' })('right{right}.com'),
          ),
        ),
      );
      const tr = editorView.state.tr;
      tr.insertText('link', left);
      tr.insertText('link', tr.mapping.map(right));
      editorView.dispatch(tr);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            a({ href: 'http://leftlink.com' })('leftlink.com'),
            a({ href: 'http://rightlink.com' })('rightlink.com'),
          ),
        ),
      );
    });
  });

  it('should not update url when text and href are different', () => {
    const { editorView, sel } = editor(
      doc(p(a({ href: 'http://google.com' })('My Co{<>}ol Link'))),
    );
    insertText(editorView, 'oo', sel);
    expect(editorView.state.doc).toEqualDocument(
      doc(p(a({ href: 'http://google.com' })('My Cooool Link'))),
    );
  });

  it('should not update url when not in message editor', () => {
    const { editorView, sel } = editor(
      doc(p(a({ href: 'http://google.com' })('goo{<>}gle.com'))),
      'comment',
    );
    insertText(editorView, 'oo', sel);
    expect(editorView.state.doc).toEqualDocument(
      doc(p(a({ href: 'http://google.com' })('goooogle.com'))),
    );
  });
});
