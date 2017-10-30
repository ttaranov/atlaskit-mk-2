import * as chai from 'chai';
import * as sinon from 'sinon';
import { expect } from 'chai';

import { browser } from '@atlaskit/editor-common';
import rulePlugins from '../../../../src/plugins/rule';
import {
  chaiPlugin, doc, hr, makeEditor, p, sendKeyToPm
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('rule', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: rulePlugins(defaultSchema),
  });

  describe('keymap', () => {
    if (browser.mac) {

      // Need to unskip after ED-2305
      context.skip('when hits Shift-Cmd--', () => {
        it('calls splitCodeBlock', () => {
          const trackEvent = sinon.spy();
          analyticsService.trackEvent = trackEvent;
          const { editorView } = editor(doc(p('text{<>}')));

          sendKeyToPm(editorView, 'Shift-Cmd--');

          expect(editorView.state.doc).to.deep.equal(doc(p('text'), hr));
          expect(trackEvent.calledWith('atlassian.editor.format.horizontalrule.keyboard')).to.equal(true);
        });
      });
      context('when hits Escape', () => {
        it('selection should not change', () => {
          const { editorView } = editor(doc(p('te{<>}xt')));
          const selectionFrom = editorView.state.selection.from;
          sendKeyToPm(editorView, 'Escape');
          const newSelectionFrom = editorView.state.selection.from;
          expect(selectionFrom).to.equal(newSelectionFrom);
        });
      });
    } else {
      context.skip('when hits Shift-Ctrl--', () => {
        it('calls splitCodeBlock', () => {
          const { editorView } = editor(doc(p('text{<>}')));

          sendKeyToPm(editorView, 'Shift-Ctrl--');

          expect(editorView.state.doc).to.deep.equal(doc(p('text'), hr));
        });
      });
    }
  });
});
