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
import codeBlockPlugin from '../../../../src/editor/plugins/code-block';
import { analyticsService } from '../../../../src/analytics';
import mentionsPlugin from '../../../../src/editor/plugins/mentions';
import listPlugin from '../../../../src/editor/plugins/lists';
import tablesPlugin from '../../../../src/editor/plugins/table';
import rulePlugin from '../../../../src/editor/plugins/rule';

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
          codeBlockPlugin,
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
      });
    });
  }
});
