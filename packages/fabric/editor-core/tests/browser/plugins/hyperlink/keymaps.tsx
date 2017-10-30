import * as chai from 'chai';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';

import hyperlinkPlugins, { HyperlinkState } from '../../../../src/plugins/hyperlink';
import HyperlinkEdit from '../../../../src/ui/HyperlinkEdit';
import PanelTextInput from '../../../../src/ui/PanelTextInput';
import {
  chaiPlugin, makeEditor, doc, p, a as link, sendKeyToPm, em, code
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

describe('hyperlink - keymap', () => {
  const editor = (doc: any) => makeEditor<HyperlinkState>({
    doc,
    plugins: hyperlinkPlugins(defaultSchema),
  });

  describe('Enter keypress', () => {
    context('when possible link text is at the end', () => {
      context('when it does not contain a link', () => {
        it('converts possible link text to hyperlink', () => {
          const trackEvent = sinon.spy();
          analyticsService.trackEvent = trackEvent;
          const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')));

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })('www.atlassian.com');
          expect(editorView.state.doc).to.deep.equal(doc(p('hello ', a), p()));
          expect(trackEvent.calledWith('atlassian.editor.format.hyperlink.autoformatting')).to.equal(true);
        });

        it('converts possible mailto link text to hyperlink', () => {
          const trackEvent = sinon.spy();
          analyticsService.trackEvent = trackEvent;
          const { editorView } = editor(doc(p('hello test@atlassian.com{<>}')));

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'mailto:test@atlassian.com' })('test@atlassian.com');
          expect(editorView.state.doc).to.deep.equal(doc(p('hello ', a), p()));
          expect(trackEvent.calledWith('atlassian.editor.format.hyperlink.autoformatting')).to.equal(true);
        });

        it('preserves other mark', () => {
          const { editorView } = editor(doc(p(em('hello www.atlassian.com{<>}'))));

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })('www.atlassian.com');
          expect(editorView.state.doc).to.deep.equal(doc(p(em('hello ', a)), p(em())));
        });
      });

      context('when it already contains a link', () => {
        it('does not convert to hyperlink', () => {
          const a = link({ href: 'http://www.google.com' })('www.atlassian.com{<>}');
          const { editorView } = editor(doc(p('hello ', a)));

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).to.deep.equal(doc(p('hello ', a), p()));
        });
      });
    });

    context('when there is no possible link text at the end', () => {
      it('does not create new link', () => {
        const { editorView } = editor(doc(p('hello world{<>}')));

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).to.deep.equal(doc(p('hello world{<>}'), p()));
      });
    });
  });

  describe('Shift-Enter keypress', () => {
    it('converts possible link text to hyperlink', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')));

      sendKeyToPm(editorView, 'Shift-Enter');

      const a = link({ href: 'http://www.atlassian.com' })('www.atlassian.com');
      expect(editorView.state.doc).to.deep.equal(doc(p('hello ', a)));
      expect(trackEvent.calledWith('atlassian.editor.format.hyperlink.autoformatting')).to.equal(true);
    });
  });

  describe('Cmd-k keypress', () => {
    it('should open floating toolbar for non-message editor', () => {
      const { editorView, pluginState } = editor(doc(p('{<}text{>}')));
      const hyperlinkEdit = mount(<HyperlinkEdit pluginState={pluginState} editorView={editorView} />);
      sendKeyToPm(editorView, 'Mod-k');
      let input = hyperlinkEdit.find(PanelTextInput);
      expect(input.length).to.equal(1);
      hyperlinkEdit.unmount();
    });

    it('should not work for message editor', () => {
      const messageEditor = (doc: any) => makeEditor<HyperlinkState>({
        doc,
        plugins: hyperlinkPlugins(defaultSchema, { appearance: 'message' }),
      });
      const { editorView, pluginState } = messageEditor(doc(p('{<}text{>}')));
      const hyperlinkEdit = mount(<HyperlinkEdit pluginState={pluginState} editorView={editorView} />);
      sendKeyToPm(editorView, 'Mod-k');
      let input = hyperlinkEdit.find(PanelTextInput);
      expect(input.length).to.equal(0);
      hyperlinkEdit.unmount();
    });

    it('should not open floating toolbar if incompatible mark is selected', () => {
      const { editorView, pluginState } = editor(doc(p(code('te{<>}xt'))));
      const hyperlinkEdit = mount(<HyperlinkEdit pluginState={pluginState} editorView={editorView} />);
      sendKeyToPm(editorView, 'Mod-k');
      let input = hyperlinkEdit.find(PanelTextInput);
      expect(input.exists()).to.equal(false);
      hyperlinkEdit.unmount();
    });
  });

});
