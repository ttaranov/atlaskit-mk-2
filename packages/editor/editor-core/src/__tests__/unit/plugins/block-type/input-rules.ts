import {
  blockquote,
  br,
  code_block,
  doc,
  h1,
  h2,
  h3,
  insertText,
  createEditor,
  p,
  code,
  hardBreak,
  a as link,
} from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../../analytics';
import codeBlockPlugin from '../../../../plugins/code-block';
import panelPlugin from '../../../../plugins/panel';
import listPlugin from '../../../../plugins/lists';

describe('inputrules', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [listPlugin, codeBlockPlugin(), panelPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
      },
    });
  let trackEvent;
  beforeEach(() => {
    trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
  });

  describe('heading rule', () => {
    it('should convert "# " to heading 1', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h1()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.heading1.autoformatting',
      );
      editorView.destroy();
    });

    it('should convert "# " after shift+enter to heading 1', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('test'), h1()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.heading1.autoformatting',
      );
      editorView.destroy();
    });

    it('should not convert "# " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('# ')));
      editorView.destroy();
    });

    it('should convert "## " to heading 2', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h2()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.heading2.autoformatting',
      );
      editorView.destroy();
    });

    it('should not convert "## " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('## ')));
      editorView.destroy();
    });

    it('should convert "### " to heading 3', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(h3()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.heading3.autoformatting',
      );
      editorView.destroy();
    });

    it('should not convert "### " to heading 3 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('### ')));
      editorView.destroy();
    });
  });

  describe('blockquote rule', () => {
    it('should convert "> " to a blockquote', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.blockquote.autoformatting',
      );
      editorView.destroy();
    });

    it('should convert "> " to a blockquote after shift+enter', () => {
      const { editorView, sel } = editor(doc(p('test', hardBreak(), '{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test'), blockquote(p())),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.blockquote.autoformatting',
      );
      editorView.destroy();
    });

    it('should convert "> " to a blockquote after multiple shift+enter', () => {
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), hardBreak(), '{<>}test')),
      );

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test', hardBreak()), blockquote(p('test'))),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.blockquote.autoformatting',
      );
      editorView.destroy();
    });

    it('should convert "> " after shift+enter to blockquote for only current line', () => {
      const { editorView, sel } = editor(
        doc(p('test1', hardBreak(), '{<>}test2', hardBreak(), 'test3')),
      );

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('test1'), blockquote(p('test2')), p('test3')),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.blockquote.autoformatting',
      );
      editorView.destroy();
    });

    it('should not convert "> " inside code mark to blockquote', () => {
      const { editorView, sel } = editor(doc(p(code('>{<>}'))));

      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(code('> '))));
      editorView.destroy();
    });

    it('should not convert "> " inside link to blockquote', () => {
      const { editorView, sel } = editor(
        doc(p(link({ href: 'http://www.atlassian.com' })('>{<>}'))),
      );
      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: 'http://www.atlassian.com' })('>'), ' ')),
      );
      editorView.destroy();
    });

    it('should not convert "> " to a blockquote when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('> ')));
      editorView.destroy();
    });
  });

  describe('codeblock rule', () => {
    describe('when node is convertable to code block', () => {
      describe('when three backticks are entered followed by space', () => {
        it('should convert "```" to a code block', () => {
          const { editorView, sel } = editor(
            doc(p('{<>}hello', br(), 'world')),
          );

          insertText(editorView, '```', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('hello\nworld')),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.codeblock.autoformatting',
          );
          editorView.destroy();
        });

        it('should convert "```" after shift+enter to a code block', () => {
          const { editorView, sel } = editor(
            doc(p('test', hardBreak(), '{<>}')),
          );

          insertText(editorView, '```', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('test'), code_block()()),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.codeblock.autoformatting',
          );
          editorView.destroy();
        });

        it('should convert "```" in middle of paragraph to a code block', () => {
          const { editorView, sel } = editor(doc(p('code ``{<>}block!')));
          insertText(editorView, '`', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('code '), code_block()('block!')),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.codeblock.autoformatting',
          );
        });

        it('should convert "```" at the end of a paragraph to a code block without preceeding content', () => {
          const { editorView, sel } = editor(doc(p('code ``{<>}')));
          insertText(editorView, '`', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('code '), code_block()()),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.codeblock.autoformatting',
          );
        });

        it('should convert "```" to a code block without first character', () => {
          const { editorView, sel } = editor(doc(p(' ``{<>}')));
          insertText(editorView, '`', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p(' '), code_block()()),
          );
        });
      });
    });
  });
});
