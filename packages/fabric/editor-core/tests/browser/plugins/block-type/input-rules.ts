import * as chai from 'chai';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { default as blockTypePlugins, BlockTypeState } from '../../../../src/plugins/block-type';
import {
  sendKeyToPm, blockquote, br, code_block, chaiPlugin, doc, h1, h2, h3, insertText, makeEditor, p, code, a as link
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('inputrules', () => {
  const editor = (doc: any) => makeEditor<BlockTypeState>({
    doc,
    plugins: blockTypePlugins(defaultSchema),
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
  });

  describe('heading rule', () => {
    it('should convert "# " to heading 1', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(h1()));
      expect(trackEvent.calledWith('atlassian.editor.format.heading1.autoformatting')).to.equal(true);
      editorView.destroy();
    });

    it('should not convert "# " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '# ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('# ')));
      editorView.destroy();
    });

    it('should convert "## " to heading 2', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(h2()));
      expect(trackEvent.calledWith('atlassian.editor.format.heading2.autoformatting')).to.equal(true);
      editorView.destroy();
    });

    it('should not convert "## " to heading 1 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '## ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('## ')));
      editorView.destroy();
    });

    it('should convert "### " to heading 3', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(h3()));
      expect(trackEvent.calledWith('atlassian.editor.format.heading3.autoformatting')).to.equal(true);
      editorView.destroy();
    });

    it('should not convert "### " to heading 3 when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '### ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('### ')));
      editorView.destroy();
    });
  });

  describe('blockquote rule', () => {
    it('should convert "> " to a blockquote', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(blockquote(p())));
      expect(trackEvent.calledWith('atlassian.editor.format.blockquote.autoformatting')).to.equal(true);
      editorView.destroy();
    });

    it('should not convert "> " inside code mark to blockquote', () => {
      const { editorView, sel } = editor(doc(p(code('>{<>}'))));

      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(p(code('> '))));
      editorView.destroy();
    });

    it('should not convert "> " inside link to blockquote', () => {
      const { editorView, sel } = editor(doc(p(link({ href: 'http://www.atlassian.com' })('>{<>}'))));
      insertText(editorView, ' ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(p(link({ href: 'http://www.atlassian.com' })('>'), ' ')));
      editorView.destroy();
    });

    it('should not convert "> " to a blockquote when inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '> ', sel);
      expect(editorView.state.doc).to.deep.equal(doc(code_block()('> ')));
      editorView.destroy();
    });
  });

  describe('codeblock rule', () => {
    context('when node is convertable to code block', () => {
      context('when three backticks are entered followed by space', () => {
        it('should convert "``` " to a code block', () => {
          const { editorView, sel } = editor(doc(p('{<>}hello', br, 'world')));

          insertText(editorView, '``` ', sel);
          expect(editorView.state.doc).to.deep.equal(doc(code_block()('hello\nworld')));
          expect(trackEvent.calledWith('atlassian.editor.format.codeblock.autoformatting')).to.equal(true);
          editorView.destroy();
        });

        it('should convert "```java " to a code block with language java', () => {
          const { editorView, sel } = editor(doc(p('{<>}hello', br, 'world')));

          insertText(editorView, '```java ', sel);
          expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'java' })('hello\nworld')));
          editorView.destroy();
        });

        it('should convert "``` " in middle of paragraph to a code block', () => {
          const { editorView, sel } = editor(doc(p('code ```{<>}')));
          insertText(editorView, ' ', sel);
          expect(editorView.state.doc).to.deep.equal(doc(code_block()('code ')));
          expect(trackEvent.calledWith('atlassian.editor.format.codeblock.autoformatting')).to.equal(true);
        });

        it('should convert "``` " in middle of paragraph to a code block and set language correctly', () => {
          const { editorView, sel } = editor(doc(p('code ```java{<>}')));
          insertText(editorView, ' ', sel);
          expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'java' })('code ')));
          expect(trackEvent.calledWith('atlassian.editor.format.codeblock.autoformatting')).to.equal(true);
        });
      });

      context('when there are more than 3 backticks', () => {
        it('should convert "`````js" to a code block with attr "language: js"', () => {
          const { editorView } = editor(doc(p('`````js{<>}')));
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'js' })('')));
          editorView.destroy();
        });
        it('should convert "code `````js" to a code block with attr "language: js" in middle of paragraph', () => {
          const { editorView } = editor(doc(p('code `````js{<>}')));
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).to.deep.equal(doc(code_block({ language: 'js' })('code ')));
        });
      });
    });
  });
});
