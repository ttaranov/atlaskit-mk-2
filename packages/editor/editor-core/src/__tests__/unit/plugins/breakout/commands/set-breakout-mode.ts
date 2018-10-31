import {
  createEditor,
  doc,
  code_block,
  breakout,
  p,
} from '@atlaskit/editor-test-helpers';
import { setBreakoutMode } from '../../../../../plugins/breakout/commands/set-breakout-mode';

describe('Breakout Commands: set-breakout-mode', () => {
  it('should wrap supported node in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      editorProps: { allowCodeBlocks: true, allowBreakout: true },
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(breakout({ mode: 'wide' })(code_block()('Hello'))),
    );
  });

  it('should not wrap unsupported node in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc(p('Hel{<>}lo')),
      editorProps: { allowCodeBlocks: true, allowBreakout: true },
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(doc(p('Hello')));
  });

  it('should be able to change nodes breakout mode', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      editorProps: { allowCodeBlocks: true, allowBreakout: true },
    });

    setBreakoutMode('full-width')(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(breakout({ mode: 'full-width' })(code_block()('Hello'))),
    );
  });
});
