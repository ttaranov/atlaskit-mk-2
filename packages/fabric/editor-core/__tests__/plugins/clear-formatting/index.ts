import * as sinon from 'sinon';

import { browser } from '@atlaskit/editor-common';
import clearFormattingPlugins, { ClearFormattingState } from '../../../src/plugins/clear-formatting';
import {
  a as link, blockquote, code_block, code, doc, em, h1, subsup,
  li, makeEditor, ol, p, panel, sendKeyToPm, strike, strong, underline, textColor
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';

describe('clear-formatting', () => {
  const editor = (doc: any) => makeEditor<ClearFormattingState>({
    doc,
    plugins: clearFormattingPlugins(defaultSchema),
  });

  describe('formattingIsPresent', () => {
    it('should be true if some marks are present', () => {
      const { pluginState } = editor(doc(p(strong('t{<}ex{>}t'))));
      expect(pluginState.formattingIsPresent).toBe(true);
    });

    it('should be true if a header is present', () => {
      const { pluginState } = editor(doc(p(h1('t{<}ex{>}t'))));
      expect(pluginState.formattingIsPresent).toBe(true);
    });

    it('should be false if a code blocks is present', () => {
      const { pluginState } = editor(doc(p('paragraph'), code_block({ language: 'java' })('code{<>}Block')));
      expect(pluginState.formattingIsPresent).toBe(false);
    });

    it('should be false if no marks are present', () => {
      const { pluginState } = editor(doc(p('text')));
      expect(pluginState.formattingIsPresent).toBe(false);
    });

    it('should be false if all present marks are cleared', () => {
      const { editorView, pluginState } = editor(doc(p(strong('{<}text{>}'))));

      pluginState.clearFormatting(editorView);
      expect(pluginState.formattingIsPresent).toBe(false);
      editorView.destroy();
    });

    it('should be false if all present blocks are cleared', () => {
      const { editorView, pluginState } = editor(doc(p('paragraph'), code_block({ language: 'java' })('code{<>}Block')));
      pluginState.clearFormatting(editorView);
      expect(pluginState.formattingIsPresent).toBe(false);
      editorView.destroy();
    });

    it('should be false if all present marks and blocks are cleared', () => {
      const { editorView, pluginState } = editor(doc(p('parag{<}raph'), code_block({ language: 'java' })('code{>}Block')));
      pluginState.clearFormatting(editorView);
      expect(pluginState.formattingIsPresent).toBe(false);
      editorView.destroy();
    });
  });

  describe('clearFormatting', () => {
    [
      { nodeName: 'strong', nodeType: strong },
      { nodeName: 'italic', nodeType: em },
      { nodeName: 'underline', nodeType: underline },
      { nodeName: 'monospace', nodeType: code },
      { nodeName: 'strikeout', nodeType: strike },
    ].forEach(({ nodeName, nodeType }) => {
      it(`should clear ${nodeName} if present`, () => {
        const { editorView, pluginState } = editor(doc(p(nodeType('t{<}ex{>}t'))));

        pluginState.clearFormatting(editorView);
        expect(editorView.state.doc).toEqualDocument(doc(p(nodeType('t'), 'ex', nodeType('t'))));

        editorView.destroy();
      });
    });

    it(`should clear text color if present`, () => {
      const blackText = textColor({ color: '#FFFFFF' });
      const { editorView, pluginState } = editor(doc(p(blackText('t{<}ex{>}t'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p(blackText('t'), 'ex', blackText('t'))));

      editorView.destroy();
    });

    it('should remove heading blocks if present', () => {
      const { editorView, pluginState } = editor(doc(h1('te{<>}xt')));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));

      editorView.destroy();
    });

    it('should remove superscript if present', () => {
      const { editorView, pluginState } = editor(doc(p(subsup({ type: 'sup'})('{<}text{>}'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));

      editorView.destroy();
    });

    it('should remove subscript if present', () => {
      const { editorView, pluginState } = editor(doc(p(subsup({ type: 'sub'})('{<}text{>}'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));

      editorView.destroy();
    });

    it('should not remove panel block if present', () => {
      const { editorView, pluginState } = editor(doc(panel(p('te{<>}xt'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(panel(p('text'))));

      editorView.destroy();
    });

    it('should not remove block-quote if present', () => {
      const { editorView, pluginState } = editor(doc(blockquote(p('te{<>}xt'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p('text'))));

      editorView.destroy();
    });

    it('should not remove link if present', () => {
      const { editorView, pluginState } = editor(doc(p(link({ href: 'http://www.atlassian.com' })('t{<}ex{>}t'))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p(link({ href: 'http://www.atlassian.com' })('text'))));

      editorView.destroy();
    });

    it('should not remove ordered list item if present', () => {
      const { editorView, pluginState } = editor(doc(ol(li(p('te{<>}xt')))));

      pluginState.clearFormatting(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('text')))));

      editorView.destroy();
    });
  });

  describe('keymap', () => {
    it('should clear formatting', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView, pluginState } = editor(doc(p(strong('t{<}ex{>}t'))));
      expect(pluginState.formattingIsPresent).toBe(true);

      if (browser.mac) {
        sendKeyToPm(editorView, 'Cmd-\\');
      } else {
        sendKeyToPm(editorView, 'Ctrl-\\');
      }

      expect(pluginState.formattingIsPresent).toBe(false);
      expect(trackEvent.calledWith('atlassian.editor.format.clear.keyboard')).toBe(true);
      editorView.destroy();
    });
  });
});
