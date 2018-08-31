import {
  doc,
  hr,
  createEditor,
  p,
  sendKeyToPm,
  bodiedExtension,
  bodiedExtensionData,
} from '@atlaskit/editor-test-helpers';
import rulePlugin from '../../../../plugins/rule';
import extensionPlugin from '../../../../plugins/extension';

describe('rule', () => {
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [rulePlugin, extensionPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
        allowExtension: {
          allowBreakout: true,
        },
      },
    });

  describe('keymap', () => {
    describe('when hits Shift-Ctrl--', () => {
      it('should create rule', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr()));
      });

      it('should create rule inside bodied ext', () => {
        const extensionAttrs = bodiedExtensionData[1].attrs;
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(p('{<>}'), p('text'))),
        );
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(bodiedExtension(extensionAttrs)(p('{<>}'), hr(), p('text'))),
        );
      });
    });
  });
});
