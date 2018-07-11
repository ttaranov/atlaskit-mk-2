import { browser } from '@atlaskit/editor-common';
import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  sendKeyToPm,
  createEditor,
  blockquote,
  doc,
  h1,
  p,
  hardBreak,
} from '@atlaskit/editor-test-helpers';
import codeBlockPlugin from '../../../../src/plugins/code-block';
import { analyticsService } from '../../../../src/analytics';
import mentionsPlugin from '../../../../src/plugins/mentions';
import listPlugin from '../../../../src/plugins/lists';
import tablesPlugin from '../../../../src/plugins/table';
import rulePlugin from '../../../../src/plugins/rule';

describe('block-type – keymaps', () => {
  if (browser.mac) {
    let trackEvent;
    const editor = (doc: any) =>
      createEditor({
        doc,
        editorProps: {
          analyticsHandler: trackEvent,
        },
        editorPlugins: [
          codeBlockPlugin(),
          mentionsPlugin,
          listPlugin,
          tablesPlugin,
          rulePlugin,
        ],
      });

    beforeEach(() => {
      trackEvent = sinon.stub();
      analyticsService.trackEvent = trackEvent;
    });

    describe('when on a Mac', () => {
      describe('when hits Cmd-Alt-9', () => {
        it('inserts blockquote', () => {
          const { editorView } = editor(doc(p('text')));
          sendKeyToPm(editorView, 'Cmd-Alt-9');
          expect(editorView.state.doc).to.deep.equal(
            doc(blockquote(p('text')))(editorView.state.schema),
          );
          expect(
            trackEvent.calledWith(
              'atlassian.editor.format.blockquote.keyboard',
            ),
          ).to.eq(true);
          editorView.destroy();
        });
      });

      describe('when blockquote nodetype is not in schema', () => {
        it('corresponding keymaps should not work', () => {
          const editor = (doc: any) =>
            createEditor({
              doc,
              editorProps: {
                allowBlockType: { exclude: ['blockquote'] },
              },
            });
          const { editorView } = editor(doc(p('text')));
          sendKeyToPm(editorView, 'Cmd-Alt-9');
          expect(editorView.state.doc).to.deep.equal(
            doc(p('text'))(editorView.state.schema),
          );
          editorView.destroy();
        });
      });

      describe('when hits Shift-Enter', () => {
        it('inserts hard-break', () => {
          const { editorView } = editor(doc(h1('t{<}ex{>}t')));
          sendKeyToPm(editorView, 'Shift-Enter');
          expect(editorView.state.doc).to.deep.equal(
            doc(h1('t', hardBreak(), 't'))(editorView.state.schema),
          );
          expect(
            trackEvent.calledWith('atlassian.editor.newline.keyboard'),
          ).to.eq(true);
          editorView.destroy();
        });

        it('can insert multiple hard-breaks', () => {
          const { editorView } = editor(doc(h1('t{<}ex{>}t')));
          sendKeyToPm(editorView, 'Shift-Enter');
          expect(editorView.state.doc).to.deep.equal(
            doc(h1('t', hardBreak(), 't'))(editorView.state.schema),
          );

          expect(
            trackEvent.calledWith('atlassian.editor.newline.keyboard'),
          ).to.eq(true);

          sendKeyToPm(editorView, 'Shift-Enter');

          expect(editorView.state.doc).to.deep.equal(
            doc(h1('t', hardBreak(), hardBreak(), 't'))(
              editorView.state.schema,
            ),
          );

          expect(
            trackEvent.calledWith('atlassian.editor.newline.keyboard'),
          ).to.eq(true);

          sinon.assert.callCount(trackEvent, 3);

          editorView.destroy();
        });

        it('moves selection along with hard-breaks', () => {
          const { editorView } = editor(doc(h1('t{<}ex{>}t')));
          const { from: initialFrom } = editorView.state.selection;

          sinon.assert.callCount(trackEvent, 1);

          // first line break
          sendKeyToPm(editorView, 'Shift-Enter');

          expect(editorView.state.doc).to.deep.equal(
            doc(h1('t', hardBreak(), 't'))(editorView.state.schema),
          );

          const { from: firstFrom, to: firstTo } = editorView.state.selection;
          expect(firstFrom).to.eq(firstTo);
          expect(firstFrom).to.eq(initialFrom + 1);

          // second line break
          sendKeyToPm(editorView, 'Shift-Enter');

          expect(editorView.state.doc).to.deep.equal(
            doc(h1('t', hardBreak(), hardBreak(), 't'))(
              editorView.state.schema,
            ),
          );

          const { from: secondFrom, to: secondTo } = editorView.state.selection;
          expect(secondFrom).to.eq(secondTo);
          expect(secondFrom).to.eq(firstFrom + 1);

          expect(
            trackEvent.calledWith('atlassian.editor.newline.keyboard'),
          ).to.eq(true);

          sinon.assert.callCount(trackEvent, 3);

          editorView.destroy();
        });
      });
    });
  }
});
