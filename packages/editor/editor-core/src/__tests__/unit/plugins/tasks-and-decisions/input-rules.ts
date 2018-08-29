import {
  sendKeyToPm,
  insertText,
  createEditor,
  doc,
  blockquote,
  p,
  decisionList,
  decisionItem,
  hardBreak,
  taskList,
  taskItem,
  thEmpty,
  table,
  tr,
  td,
  th,
  tdEmpty,
  tdCursor,
  thCursor,
  a as link,
  br,
  bodiedExtension,
  layoutColumn,
  layoutSection,
} from '@atlaskit/editor-test-helpers';
import { uuid } from '@atlaskit/editor-common';

describe('tasks and decisions - input rules', () => {
  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) =>
    createEditor({
      editorProps: {
        allowTasksAndDecisions: true,
        allowTables: true,
        allowExtension: true,
        allowLayouts: true,
      },
      doc,
    });

  describe('decisions', () => {
    it('should replace "<> " with a decisionList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })(''),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside table header', () => {
      const { editorView, sel } = editor(
        doc(table()(tr(thCursor), tr(tdEmpty), tr(tdEmpty))),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(
              th({})(
                decisionList({ localId: 'local-decision' })(
                  decisionItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(table()(tr(thEmpty), tr(tdCursor), tr(tdEmpty))),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(thEmpty),
            tr(
              td({})(
                decisionList({ localId: 'local-decision' })(
                  decisionItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "<> " after shift+enter with a decisionList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(
          table()(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '{<>}'))),
            tr(tdEmpty),
          ),
        ),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(thEmpty),
            tr(
              td({})(
                p('Hello'),
                decisionList({ localId: 'local-decision' })(
                  decisionItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })('Hello World'),
          ),
        ),
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(
        doc(p('Hello', hardBreak(), '{<>}World')),
      );
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Hello'),
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })('World'),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside bodiedExtension', () => {
      const { editorView, sel } = editor(
        doc(
          bodiedExtension({
            extensionKey: 'key',
            extensionType: 'type',
          })(p('{<>}')),
        ),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension({
            extensionKey: 'key',
            extensionType: 'type',
          })(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(),
            ),
          ),
        ),
      );
    });

    it('should replace "<> " with a decisionList inside layouts', () => {
      const { editorView, sel } = editor(
        doc(layoutSection()(layoutColumn(p('{<>}')), layoutColumn(p('')))),
      );

      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection()(
            layoutColumn(
              decisionList({ localId: 'local-decision' })(
                decisionItem({ localId: 'local-decision' })(''),
              ),
            ),
            layoutColumn(p('')),
          ),
        ),
      );
    });

    it('should not create decisionList inside nested blockquote', () => {
      const { editorView, sel } = editor(
        doc(blockquote(p('Hello World'), p('{<>}'))),
      );
      insertText(editorView, '<> ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello World'), p('<> '))),
      );
    });

    it('should convert long link to hyperlink in decision', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);
      insertText(
        editorView,
        'media-playground.us-west-1.staging.atl-pass.net ',
        sel + 1,
      );

      const a = link({
        href: 'http://media-playground.us-west-1.staging.atl-pass.net',
      })('media-playground.us-west-1.staging.atl-pass.net');
      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })(a, ' '),
          ),
        ),
      );
    });

    it('should convert markdown link in decision', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);
      insertText(editorView, '[text](http://foo)', sel + 1);

      const a = link({ href: 'http://foo' })('text');
      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })(a),
          ),
        ),
      );
    });

    it('should add hardbreaks on Shift-Enter', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '<> ', sel);
      sendKeyToPm(editorView, 'Shift-Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          decisionList({ localId: 'local-decision' })(
            decisionItem({ localId: 'local-decision' })(br()),
          ),
        ),
      );
    });
  });

  describe('tasks', () => {
    it('should replace "[] " with a taskList', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })(''),
          ),
        ),
      );
    });

    it('should preserve existing content on row when converting', () => {
      const { editorView, sel } = editor(doc(p('{<>}Hello World')));
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })('Hello World'),
          ),
        ),
      );
    });

    it('should split on hardBreak and preserve content when converting', () => {
      const { editorView, sel } = editor(
        doc(p('Hello', hardBreak(), '{<>}World')),
      );
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('Hello'),
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })('World'),
          ),
        ),
      );
    });
    it('should replace "[] " with a taskList inside table header', () => {
      const { editorView, sel } = editor(
        doc(table()(tr(thCursor), tr(tdEmpty), tr(tdEmpty))),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(
              th({})(
                taskList({ localId: 'local-decision' })(
                  taskItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "[] " with a taskList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(table()(tr(thEmpty), tr(tdCursor), tr(tdEmpty))),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(thEmpty),
            tr(
              td({})(
                taskList({ localId: 'local-decision' })(
                  taskItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "[] " after shift+enter with a taskList inside table cell', () => {
      const { editorView, sel } = editor(
        doc(
          table()(
            tr(thEmpty),
            tr(td({})(p('Hello', hardBreak(), '{<>}'))),
            tr(tdEmpty),
          ),
        ),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table()(
            tr(thEmpty),
            tr(
              td({})(
                p('Hello'),
                taskList({ localId: 'local-decision' })(
                  taskItem({ localId: 'local-decision' })(''),
                ),
              ),
            ),
            tr(tdEmpty),
          ),
        ),
      );
    });

    it('should replace "[] " with a taskList inside bodiedExtension', () => {
      const { editorView, sel } = editor(
        doc(
          bodiedExtension({
            extensionKey: 'key',
            extensionType: 'type',
          })(p('{<>}')),
        ),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          bodiedExtension({
            extensionKey: 'key',
            extensionType: 'type',
          })(
            taskList({ localId: 'local-decision' })(
              taskItem({ localId: 'local-decision' })(),
            ),
          ),
        ),
      );
    });

    it('should replace "[] " with a taskList inside layouts', () => {
      const { editorView, sel } = editor(
        doc(layoutSection()(layoutColumn(p('{<>}')), layoutColumn(p('')))),
      );

      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection()(
            layoutColumn(
              taskList({ localId: 'local-decision' })(
                taskItem({ localId: 'local-decision' })(''),
              ),
            ),
            layoutColumn(p('')),
          ),
        ),
      );
    });

    it('should not create taskList inside blockquote', () => {
      const { editorView, sel } = editor(
        doc(blockquote(p('Hello World'), p('{<>}'))),
      );
      insertText(editorView, '[] ', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello World'), p('[] '))),
      );
    });

    it('should convert long link to hyperlink in action', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[] ', sel);
      insertText(
        editorView,
        'media-playground.us-west-1.staging.atl-paas.net ',
        sel + 1,
      );

      const a = link({
        href: 'http://media-playground.us-west-1.staging.atl-paas.net',
      })('media-playground.us-west-1.staging.atl-paas.net');
      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })(a, ' '),
          ),
        ),
      );
    });

    it('should convert markdown link in action', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '[] ', sel);
      insertText(editorView, '[text](http://foo)', sel + 1);

      const a = link({ href: 'http://foo' })('text');
      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'local-decision' })(
            taskItem({ localId: 'local-decision' })(a),
          ),
        ),
      );
    });
  });
});
