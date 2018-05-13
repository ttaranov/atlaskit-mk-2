import { NodeSelection } from 'prosemirror-state';
import {
  createEditor,
  doc,
  p,
  code_block,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';

describe('IDE UX plugin', () => {
  const editor = doc =>
    createEditor({ doc, editorProps: { allowCodeBlocks: true } });
  describe('Select-All', () => {
    describe('when cursor inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const { editorView, refs: { start, end } } = editor(
          doc(p('start'), code_block()('{start}mid{<>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-A');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });
    describe('when selection inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const { editorView, refs: { start, end } } = editor(
          doc(p('start'), code_block()('{start}{<}mid{>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-A');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });

    describe('when starts inside code-block and finished outside', () => {
      it('should do nothing when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start'), code_block()('mid{<}dle'), p('en{>}d')),
        );
        const originalSelection = editorView.state.selection;
        sendKeyToPm(editorView, 'Mod-A');
        expect(editorView.state.selection.eq(originalSelection)).toBe(true);
      });
    });

    describe('when selection starts outside code-block and finishes inside', () => {
      it('should do nothing when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start{<}'), code_block()('mid{>}dle'), p('end')),
        );
        const originalSelection = editorView.state.selection;
        sendKeyToPm(editorView, 'Mod-A');
        expect(editorView.state.selection.eq(originalSelection)).toBe(true);
      });
    });
  });
});
