import * as sinon from 'sinon';

import { browser } from '@atlaskit/editor-common';
import rulePlugins from '../../../src/plugins/rule';
import {
  doc, hr, makeEditor, p, sendKeyToPm
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';


describe('rule', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: rulePlugins(defaultSchema),
  });

  describe('keymap', () => {
    if (browser.mac) {

      // Need to unskip after ED-2305
      describe.skip('when hits Shift-Cmd--', () => {
        it('calls splitCodeBlock', () => {
          const trackEvent = sinon.spy();
          analyticsService.trackEvent = trackEvent;
          const { editorView } = editor(doc(p('text{<>}')));

          sendKeyToPm(editorView, 'Shift-Cmd--');

          expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr));
          expect(trackEvent.calledWith('atlassian.editor.format.horizontalrule.keyboard')).toBe(true);
        });
      });
      describe('when hits Escape', () => {
        it('selection should not change', () => {
          const { editorView } = editor(doc(p('te{<>}xt')));
          const selectionFrom = editorView.state.selection.from;
          sendKeyToPm(editorView, 'Escape');
          const newSelectionFrom = editorView.state.selection.from;
          expect(selectionFrom).toBe(newSelectionFrom);
        });
      });
    } else {
      describe.skip('when hits Shift-Ctrl--', () => {
        it('calls splitCodeBlock', () => {
          const { editorView } = editor(doc(p('text{<>}')));

          sendKeyToPm(editorView, 'Shift-Ctrl--');

          expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr));
        });
      });
    }
  });
});
