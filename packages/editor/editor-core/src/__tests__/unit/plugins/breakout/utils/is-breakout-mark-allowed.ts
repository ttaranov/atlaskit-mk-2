import {
  createEditor,
  doc,
  code_block,
  p,
} from '@atlaskit/editor-test-helpers';
import { isBreakoutMarkAllowed } from '../../../../../plugins/breakout/utils/is-breakout-mark-allowed';

describe('Breakout Commands: getBreakoutMode', () => {
  it('should return true for allowed nodes', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      editorProps: { allowCodeBlocks: true, allowBreakout: true },
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(true);
  });

  it('should return false for not allowed ndoes', () => {
    const { editorView } = createEditor({
      doc: doc(p('Hel{<>}lo')),
      editorProps: { allowCodeBlocks: true, allowBreakout: true },
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(false);
  });
});
