import {
  doc,
  hr,
  createEditor,
  p,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import rulePlugin from '../../../src/plugins/rule';

describe('rule', () => {
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [rulePlugin],
      editorProps: {
        analyticsHandler: trackEvent,
      },
    });

  describe('keymap', () => {
    describe('when hits Shift-Ctrl--', () => {
      it('calls splitCodeBlock', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr()));
      });
    });
  });
});
