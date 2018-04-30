import {
  doc,
  createEditor,
  p,
  code,
  strong,
} from '@atlaskit/editor-test-helpers';
import textFormattingCursorPlugin from '../../../src/plugins/text-formatting/pm-plugins/cursor';
import { EditorView } from 'prosemirror-view';

type HandleClick = (
  view: EditorView,
  pos: number,
  event: MouseEvent,
) => boolean;
let handleClick: HandleClick = textFormattingCursorPlugin.spec!.props
  .handleClick;

describe('text-formatting', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTextFormatting: true,
      },
    });

  describe('cursor', () => {
    describe('inline-code cursor handling', () => {
      describe('when clicking on the right edge', () => {
        describe('inside the inline-code element', () => {
          it('should add the code mark to the selection', () => {
            const { editorView, refs: { click } } = editor(
              doc(p('start', code('code{click}'), ' end')),
            );
            // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
            const codeDOM = (editorView as any).docView.domFromPos(click - 1)
              .node.parentNode;
            const mouseEvent = { target: codeDOM } as MouseEvent;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([
              editorView.state.schema.marks.code.create(),
            ]);
          });
        });
        describe('outside the inline-code element', () => {
          it('should not add the code mark to the selection', () => {
            const { editorView, refs: { click } } = editor(
              doc(p('start', code('code{click}'), ' end')),
            );
            // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
            const outsideNodeDOM = (editorView as any).docView.domFromPos(click)
              .node;
            const mouseEvent = { target: outsideNodeDOM } as MouseEvent;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([]);
          });

          it('should preserve the marks from the outside node', () => {
            const { editorView, refs: { click } } = editor(
              doc(p('start', code('code{click}'), strong(' end'))),
            );
            // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
            const outsideNodeDOM = (editorView as any).docView.domFromPos(click)
              .node;
            const mouseEvent = { target: outsideNodeDOM } as MouseEvent;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([
              editorView.state.schema.marks.strong.create(),
            ]);
          });
        });
        describe('at the end of a paragraph', () => {
          it('should not add the code mark to the selection', () => {
            const { editorView, refs: { click } } = editor(
              doc(p('start', code('code{click}'))),
            );
            // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
            const outsideNodeDOM = (editorView as any).docView.domFromPos(click)
              .node;
            const mouseEvent = { target: outsideNodeDOM } as MouseEvent;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([]);
          });
        });
      });
    });
    describe('when clicking on the left edge', () => {
      describe('inside the inline-code element', () => {
        it('should add the code mark to the selection', () => {
          const { editorView, refs: { click } } = editor(
            doc(p('start', code('{click}code'), ' end')),
          );
          // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
          const codeDOM = (editorView as any).docView.domFromPos(click + 1).node
            .parentNode;
          const mouseEvent = { target: codeDOM } as MouseEvent;
          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([
            editorView.state.schema.marks.code.create(),
          ]);
        });
      });
      describe('outside the inline-code element', () => {
        it('should not add the code mark to the selection', () => {
          const { editorView, refs: { click } } = editor(
            doc(p('start{click}', code('code'), ' end')),
          );
          // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
          const outsideNodeDOM = (editorView as any).docView.domFromPos(
            click - 1,
          ).node;
          const mouseEvent = { target: outsideNodeDOM } as MouseEvent;
          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([]);
        });

        it('should preserve the marks from the outside node', () => {
          const { editorView, refs: { click } } = editor(
            doc(p(strong('start{click}'), code('code'), ' end')),
          );
          // Can be replaced with EditorView::domAtPos once we've upgraded to prosemirror-view 1.3
          const outsideNodeDOM = (editorView as any).docView.domFromPos(
            click - 1,
          ).node;
          const mouseEvent = { target: outsideNodeDOM } as MouseEvent;
          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([
            editorView.state.schema.marks.strong.create(),
          ]);
        });
      });
    });
  });
});
