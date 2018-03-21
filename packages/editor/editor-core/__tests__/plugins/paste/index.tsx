import {
  code_block,
  strong,
  em,
  doc,
  p,
  code,
  mediaGroup,
  media,
  mediaSingle,
  createEditor,
  dispatchPasteEvent,
  bodiedExtension,
  a as link,
} from '@atlaskit/editor-test-helpers';
import mediaPlugin from '../../../src/plugins/media';
import codeBlockPlugin from '../../../src/plugins/code-block';
import extensionPlugin from '../../../src/plugins/extension';

describe('paste plugins', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [
        mediaPlugin({ allowMediaSingle: true }),
        codeBlockPlugin,
        extensionPlugin,
      ],
    });

  const messageEditor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [mediaPlugin(), codeBlockPlugin],
      editorProps: { appearance: 'message' },
    });

  describe('handlePaste', () => {
    const mediaHtml = (fileMimeType: string) => `
      <div
      data-id="af9310df-fee5-459a-a968-99062ecbb756"
      data-node-type="media" data-type="file"
      data-collection="MediaServicesSample"
      title="Attachment"
      data-file-mime-type="${fileMimeType}"></div>`;

    describe('message editor', () => {
      it('pastes', () => {
        const { editorView } = messageEditor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: mediaHtml('image/jpeg'),
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(),
            mediaGroup(
              media({
                id: 'af9310df-fee5-459a-a968-99062ecbb756',
                type: 'file',
                collection: 'MediaServicesSample',
                __fileMimeType: 'image/jpeg',
              })(),
            ),
            p(),
          ),
        );
      });
    });

    describe('non message editor', () => {
      describe('when message is a media image node', () => {
        it('paste as mediaSingle', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: mediaHtml('image/jpeg'),
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
              p(),
            ),
          );
        });
      });

      describe('when message is not a media image node', async () => {
        it('does nothing', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: mediaHtml('pdf'),
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(),
              mediaGroup(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'pdf',
                })(),
              ),
              p(),
            ),
          );
        });
      });
    });

    it('should not create paragraph when plain text is copied in code-block', () => {
      const { editorView } = editor(doc(code_block()('{<>}')));
      dispatchPasteEvent(editorView, { plain: 'plain text' });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('plain text')),
      );
    });

    it('should create paragraph when plain text is not copied in code-block', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, { plain: 'plain text' });
      expect(editorView.state.doc).toEqualDocument(doc(p('plain text')));
    });

    describe('hyperlink as a plain text', () => {
      it('should linkify hyperlink if it contains "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/...blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "---"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/---blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "~~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains combination of "~~~", "---" and "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~bla...bla---bla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should parse Urls with nested parentheses', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/?jql=(foo())bar';
        const text = `**Hello** ${href} _World_`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong('Hello'), ' ', link({ href })(href), ' ', em('World'))),
        );
      });

      it('should remove ` if code mark is pasted immediately after it', () => {
        const { editorView } = editor(doc(p('`{<>}')));
        dispatchPasteEvent(editorView, {
          plain: 'hello',
          html: '<pre>hello</pre>',
        });
        expect(editorView.state.doc).toEqualDocument(doc(p(code('hello'))));
      });

      it('should not create code block for whitespace pre-wrap css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/__text__/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "**text**"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/**text**/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "~~text~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~text~~/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      describe('if pasted markdown followed by hyperlink', () => {
        it('should parse markdown and create a hyperlink', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const href = 'http://example.com/?...jql=(foo())bar';
          const text = `**Hello** ${href} _World_`;
          dispatchPasteEvent(editorView, { plain: text });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(strong('Hello'), ' ', link({ href })(href), ' ', em('World')),
            ),
          );
        });
      });
    });

    it('should create code-block for multiple lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code line 1\ncode line 2')),
      );
    });

    it('should create code mark for single lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code single line',
        html: '<pre>code single line</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('code single line'))),
      );
    });

    it('should create code block for font-family monospace css', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><div style="font-family: Menlo, Monaco, 'Courier New', monospace;white-space: pre;">Code :D</div>`,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('Code :D')),
      );
    });

    it('should create code block for whitespace pre css', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><div style="white-space: pre;">Hello</div>`,
      });
      expect(editorView.state.doc).toEqualDocument(doc(code_block()('Hello')));
    });

    it('should not create code block for whitespace pre-wrap css', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><div style="white-space: pre-wrap;">Hello</div>`,
      });
      expect(editorView.state.doc).toEqualDocument(doc(p('Hello')));
    });

    it('should not handle events with Files type', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'my-awesome-mug.png',
        types: ['text/plain', 'Files'],
      });
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should work properly when pasting multiple link markdowns', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain:
          '[commit #1 title](https://bitbucket.org/SOME/REPO/commits/commit-id-1)\n' +
          '[commit #2 title](https://bitbucket.org/SOME/REPO/commits/commit-id-2)\n' +
          '[commit #3 title](https://bitbucket.org/SOME/REPO/commits/commit-id-3)\n' +
          '[commit #4 title](https://bitbucket.org/SOME/REPO/commits/commit-id-4)',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-1',
            })('commit #1 title'),
            '\n',
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-2',
            })('commit #2 title'),
            '\n',
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-3',
            })('commit #3 title'),
            '\n',
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-4',
            })('commit #4 title'),
          ),
        ),
      );
    });
  });

  describe('paste bodiedExtension inside another bodiedExtension', () => {
    it('should remove bodiedExtension from the pasted content', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
      };
      const { editorView } = editor(doc(bodiedExtension(attrs)(p('{<>}'))));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><p data-pm-context="[]">text</p><div data-node-type="bodied-extension" data-extension-type="com.atlassian.confluence.macro.core" data-extension-key="expand" data-parameters="{&quot;macroMetadata&quot;:{&quot;macroId&quot;:{&quot;value&quot;:1521116439714},&quot;schemaVersion&quot;:{&quot;value&quot;:&quot;2&quot;},&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&amp;locale=en_GB&amp;version=2&quot;},&quot;type&quot;:&quot;image&quot;}]}}"><p>text</p></div>`,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(bodiedExtension(attrs)(p('text'))),
      );
    });
  });
});
