import {
  createEditor,
  doc,
  p,
  a,
  code_block,
  code,
} from '@atlaskit/editor-test-helpers';
import {
  setLinkHref,
  setLinkText,
  showLinkToolbar,
  insertLink,
  hideLinkToolbar,
  removeLink,
} from '../../../../plugins/hyperlink/commands';
import {
  stateKey as hyperlinkStateKey,
  LinkAction,
} from '../../../../plugins/hyperlink/pm-plugins/main';

const editor = doc =>
  createEditor({ doc, editorProps: { allowCodeBlocks: true } });

describe('hyperlink commands', () => {
  describe('#setLinkHref', () => {
    it('should not set the link href when pos is not inside a link node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        setLinkHref(sel, 'https://google.com')(view.state, view.dispatch),
      ).toBe(false);
    });
    it('should remove the link mark when the href is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(setLinkHref(sel, '')(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(doc(p('text')));
    });
    it('should set normalized link href when the href is non-empty', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(setLinkHref(sel, 'google.com')(view.state, view.dispatch)).toBe(
        true,
      );
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('text'))),
      );
    });
    it('should set mailto: prefix when the href is email-like', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(
        setLinkHref(sel, 'scott@google.com')(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'mailto:scott@google.com' })('text'))),
      );
    });
  });
  describe('#setLinkText', () => {
    it('should not set the link text when pos is not at a link node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(setLinkText(sel, 'google')(view.state, view.dispatch)).toBe(false);
    });
    it('should not set the link text when text is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(setLinkText(sel, '')(view.state, view.dispatch)).toBe(false);
    });
    it('should not set the link text when text is equal to the node.text', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}google.com'))),
      );
      expect(setLinkText(sel, 'google.com')(view.state, view.dispatch)).toBe(
        false,
      );
    });
    it('should set the link text when the text is non-empty', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(setLinkText(sel, 'hi!')(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('hi!'))),
      );
    });
  });
  describe('#insertLink', () => {
    it('should not insert link when selection is inside an incompatible node', () => {
      const { editorView: view, sel } = editor(doc(code_block()('{<>}')));
      expect(
        insertLink(sel, sel, 'google.com')(view.state, view.dispatch),
      ).toBe(false);
    });
    it('should not insert link when selection is across incompatible nodes', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}hello'), p('world{>}')));
      expect(
        insertLink(from, to, 'google.com')(view.state, view.dispatch),
      ).toBe(false);
    });
    it('should not insert link when selection is across incompatible marks', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p(code('{<}hello'), 'world{>}')));
      expect(
        insertLink(from, to, 'google.com')(view.state, view.dispatch),
      ).toBe(false);
    });
    it('should not insert link when selection includes an existing link', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}hello ', a({ href: '' })('there'), ' world{>}')));
      expect(
        insertLink(from, to, 'google.com')(view.state, view.dispatch),
      ).toBe(false);
    });
    it('should not insert link when href is an empty string', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(insertLink(sel, sel, '')(view.state, view.dispatch)).toBe(false);
    });
    it('should insert normalized link when selection is a cursor and href is a non-empty string', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(sel, sel, 'google.com')(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('google.com'))),
      );
    });
    it('should insert normalized link when selection is a range and href is a non-empty string', () => {
      const {
        editorView: view,
        refs: { '<': from, '>': to },
      } = editor(doc(p('{<}example_link{>}')));
      expect(
        insertLink(from, to, 'google.com')(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'http://google.com' })('example_link'))),
      );
    });
    it('should set mailto: prefix when the href is email-like', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(
        insertLink(sel, sel, 'scott@google.com')(view.state, view.dispatch),
      ).toBe(true);
      expect(view.state.doc).toEqualDocument(
        doc(p(a({ href: 'mailto:scott@google.com' })('scott@google.com'))),
      );
    });
  });
  describe('#removeLink', () => {
    it('should remove the link mark when the href is an empty string', () => {
      const { editorView: view, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}text'))),
      );
      expect(removeLink(sel)(view.state, view.dispatch)).toBe(true);
      expect(view.state.doc).toEqualDocument(doc(p('text')));
    });
    it('should not set remove the link href when pos is not inside a link node', () => {
      const { editorView: view, sel } = editor(doc(p('{<>}')));
      expect(removeLink(sel)(view.state, view.dispatch)).toBe(false);
    });
  });
  describe('#showLinkToolbar', () => {
    it('should trigger the SHOW_INSERT_TOOLBAR for the hyperlink plugin', () => {
      const { editorView: view } = editor(doc(p('{<>}')));
      const dispatchMock = jest.spyOn(view, 'dispatch');
      expect(showLinkToolbar()(view.state, view.dispatch)).toBe(true);
      expect(dispatchMock.mock.calls[0][0].getMeta(hyperlinkStateKey)).toBe(
        LinkAction.SHOW_INSERT_TOOLBAR,
      );
    });
  });

  describe('#hideLinkToolbar', () => {
    it('should trigger the HIDE_TOOLBAR for the hyperlink plugin', () => {
      const { editorView: view } = editor(doc(p('{<>}')));
      const dispatchMock = jest.spyOn(view, 'dispatch');
      expect(hideLinkToolbar()(view.state, view.dispatch)).toBe(true);
      expect(dispatchMock.mock.calls[0][0].getMeta(hyperlinkStateKey)).toBe(
        LinkAction.HIDE_TOOLBAR,
      );
    });
  });
});
