import * as React from 'react';
import {
  doc,
  createEditor,
  a,
  p,
  insertText,
} from '@atlaskit/editor-test-helpers';

describe('hyperlink', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
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
    it('should not update both href and text on edit if they were same before', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('http://goo{<>}gle.com'))),
      );
      insertText(editorView, 'ooo', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('http://gooooogle.com'))),
      );
    });
    it('should not update both href and scheme-less url text on edit if they were same before', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'http://google.com' })('goo{<>}gle.com'))),
      );
      insertText(editorView, 'ooo', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('gooooogle.com'))),
      );
    });
  });
});
