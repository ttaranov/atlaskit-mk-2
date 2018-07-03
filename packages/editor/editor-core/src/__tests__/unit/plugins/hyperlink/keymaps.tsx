import { mount } from 'enzyme';
import * as React from 'react';

import { hyperlinkPluginKey } from '../../../../plugins/hyperlink';
import HyperlinkEdit from '../../../../plugins/hyperlink/ui/HyperlinkEdit';
import PanelTextInput from '../../../../ui/PanelTextInput';
import {
  createEditor,
  doc,
  p,
  a as link,
  sendKeyToPm,
  em,
  code,
  hardBreak,
} from '@atlaskit/editor-test-helpers';

describe('hyperlink - keymap', () => {
  const editor = (doc: any, editorProps = {}) =>
    createEditor({
      doc,
      editorProps,
      pluginKey: hyperlinkPluginKey,
    });

  describe('Enter keypress', () => {
    describe('when possible link text is at the end', () => {
      describe('when it does not contain a link', () => {
        it('converts possible link text to hyperlink', () => {
          const trackEvent = jest.fn();
          const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')), {
            analyticsHandler: trackEvent,
          });

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })(
            'www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.hyperlink.autoformatting',
          );
        });

        it('converts possible mailto link text to hyperlink', () => {
          const trackEvent = jest.fn();
          const { editorView } = editor(
            doc(p('hello test@atlassian.com{<>}')),
            { analyticsHandler: trackEvent },
          );

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'mailto:test@atlassian.com' })(
            'test@atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.editor.format.hyperlink.autoformatting',
          );
        });

        it('preserves other mark', () => {
          const { editorView } = editor(
            doc(p(em('hello www.atlassian.com{<>}'))),
          );

          sendKeyToPm(editorView, 'Enter');

          const a = link({ href: 'http://www.atlassian.com' })(
            'www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(
            doc(p(em('hello ', a)), p(em())),
          );
        });
      });

      describe('when it already contains a link', () => {
        it('does not convert to hyperlink', () => {
          const a = link({ href: 'http://www.google.com' })(
            'www.atlassian.com{<>}',
          );
          const { editorView } = editor(doc(p('hello ', a)));

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', a), p()),
          );
        });
      });
    });

    describe('when there is no possible link text at the end', () => {
      it('does not create new link', () => {
        const { editorView } = editor(doc(p('hello world{<>}')));

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello world{<>}'), p()),
        );
      });
    });
  });

  describe('Shift-Enter keypress', () => {
    it('converts possible link text to hyperlink', () => {
      const trackEvent = jest.fn();
      const { editorView } = editor(doc(p('hello www.atlassian.com{<>}')), {
        analyticsHandler: trackEvent,
      });

      sendKeyToPm(editorView, 'Shift-Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello ',
            link({ href: 'http://www.atlassian.com' })('www.atlassian.com'),
            hardBreak(),
          ),
        ),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.hyperlink.autoformatting',
      );
    });
  });

  describe('Cmd-k keypress', () => {
    it('should open floating toolbar for non-message editor', () => {
      const { editorView, pluginState } = editor(doc(p('{<}text{>}')));
      const hyperlinkEdit = mount(
        <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
      );
      sendKeyToPm(editorView, 'Mod-k');
      hyperlinkEdit.update();
      const input = hyperlinkEdit.find(PanelTextInput);
      expect(input.length).toEqual(1);
      hyperlinkEdit.unmount();
    });

    it('should not work for message editor', () => {
      const { editorView, pluginState } = editor(doc(p('{<}text{>}')), {
        appearance: 'message',
      });
      const hyperlinkEdit = mount(
        <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
      );
      sendKeyToPm(editorView, 'Mod-k');
      const input = hyperlinkEdit.find(PanelTextInput);
      expect(input.length).toEqual(0);
      hyperlinkEdit.unmount();
    });

    it('should not open floating toolbar if incompatible mark is selected', () => {
      const { editorView, pluginState } = editor(doc(p(code('te{<>}xt'))), {
        appearance: 'message',
      });
      const hyperlinkEdit = mount(
        <HyperlinkEdit pluginState={pluginState} editorView={editorView} />,
      );
      sendKeyToPm(editorView, 'Mod-k');
      const input = hyperlinkEdit.find(PanelTextInput);
      expect(input.exists()).toBe(false);
      hyperlinkEdit.unmount();
    });
  });
});
