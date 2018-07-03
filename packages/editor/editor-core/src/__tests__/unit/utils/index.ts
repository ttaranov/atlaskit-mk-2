import {
  doc,
  code_block,
  code,
  p,
  strong,
  createEditor,
  panel,
  blockquote,
  h1,
  ul,
  ol,
  li,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  media,
  mediaGroup,
  mediaSingle,
} from '@atlaskit/editor-test-helpers';
import { toggleMark } from 'prosemirror-commands';

import {
  isMarkTypeAllowedInCurrentSelection,
  areBlockTypesDisabled,
  isEmptyNode,
} from '../../../utils';
import mediaPlugin from '../../../plugins/media';
import codeBlockPlugin from '../../../plugins/code-block';
import panelPlugin from '../../../plugins/panel';
import listPlugin from '../../../plugins/lists';
import mentionsPlugin from '../../../plugins/mentions';
import tasksAndDecisionsPlugin from '../../../plugins/tasks-and-decisions';

describe('@atlaskit/editore-core/utils', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [
        mediaPlugin({ allowMediaSingle: true }),
        codeBlockPlugin(),
        panelPlugin,
        listPlugin,
        mentionsPlugin,
        tasksAndDecisionsPlugin,
      ],
    });

  describe('#isMarkTypeAllowedInCurrentSelection', () => {
    describe('when the current node supports the given mark type', () => {
      describe('and a stored mark is present', () => {
        it('returns true if given mark type is not excluded', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const { mentionQuery, strong } = editorView.state.schema.marks;
          toggleMark(strong)(editorView.state, editorView.dispatch);

          let result = isMarkTypeAllowedInCurrentSelection(
            mentionQuery,
            editorView.state,
          );
          expect(result).toBe(true);
        });

        it('returns false if given mark type is excluded', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const { mentionQuery, code } = editorView.state.schema.marks;
          toggleMark(code)(editorView.state, editorView.dispatch);

          let result = isMarkTypeAllowedInCurrentSelection(
            mentionQuery,
            editorView.state,
          );
          expect(result).toBe(false);
        });
      });

      describe('without a stored mark present', () => {
        describe('and the selection is empty', () => {
          it('returns true if given mark type not excluded', () => {
            const { editorView } = editor(doc(p(strong('te{<>}xt'))));
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if given mark type is excluded', () => {
            const { editorView } = editor(doc(p(code('te{<>}xt'))));
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });
        });

        describe('and a non-empty selection', () => {
          it('returns false if mark type is allowed at the start of the selection', () => {
            const { editorView } = editor(
              doc(p(strong('t{<}e'), code('xt{>}'))),
            );
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });

          it('returns true if the selection starts at the end of an excluded mark type', () => {
            const { editorView } = editor(
              doc(p(code('te{<}'), strong('xt{>}'))),
            );
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if mark type is excluded at the start of the selection', () => {
            const { editorView } = editor(
              doc(p(code('t{<}e'), strong('xt{>}'))),
            );
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });

          it('returns true if the selection ends at the start of an excluded mark type', () => {
            const { editorView } = editor(
              doc(p(strong('{<}te'), code('{>}xt'))),
            );
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if the selection includes an excluded node', () => {
            const { editorView } = editor(
              doc(p(strong('{<}text'), code('text'), strong('text{>}'))),
            );
            const { mentionQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              mentionQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });
        });
      });
    });

    describe('when the current node does not support the given mark type', () => {
      it('returns false', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));
        const { mentionQuery } = editorView.state.schema.marks;

        let result = isMarkTypeAllowedInCurrentSelection(
          mentionQuery,
          editorView.state,
        );
        expect(result).toBe(false);
      });
    });
  });

  describe('#areBlockTypesDisabled', () => {
    it('should return true is selection has a blockquote', () => {
      const { editorView } = editor(
        doc(blockquote(p('te{<}xt')), panel()(p('te{>}xt'))),
      );
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(true);
    });

    it('should return false is selection has no blockquote', () => {
      const { editorView } = editor(doc(p('te{<}xt'), panel()(p('te{>}xt'))));
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(false);
    });
  });

  describe('#isEmptyNode', () => {
    const { editorView } = editor(doc(p('')));
    const checkEmptyNode = node =>
      isEmptyNode(editorView.state.schema)(node(editorView.state.schema));

    it('it should return true for empty paragraph', () => {
      expect(checkEmptyNode(p())).toBeTruthy();
    });
    it('it should return false for non-empty paragraph', () => {
      expect(checkEmptyNode(p('x'))).toBeFalsy();
    });
    it('it should return false for invisible content', () => {
      expect(checkEmptyNode(p('\u200c'))).toBeFalsy();
    });

    it('it should return true for empty codeBlock', () => {
      expect(checkEmptyNode(code_block()())).toBeTruthy();
    });
    it('it should return false for non-empty codeBlock', () => {
      expect(checkEmptyNode(code_block()('var x = 1;'))).toBeFalsy();
    });

    it('it should return true for empty heading', () => {
      expect(checkEmptyNode(h1())).toBeTruthy();
    });
    it('it should return false for non-empty heading', () => {
      expect(checkEmptyNode(h1('Hello!'))).toBeFalsy();
    });

    it('it should return true for empty blockquote', () => {
      expect(checkEmptyNode(blockquote(p()))).toBeTruthy();
    });
    it('it should return false for non-empty blockquote', () => {
      expect(checkEmptyNode(blockquote(p('Hello! - A')))).toBeFalsy();
    });

    it('it should return true for empty panel', () => {
      expect(checkEmptyNode(panel()(p('')))).toBeTruthy();
    });
    it('it should return false for non-empty panel', () => {
      expect(checkEmptyNode(panel()(p('Hello! - A')))).toBeFalsy();
    });

    it('it should return true for empty unordered list', () => {
      expect(checkEmptyNode(ul(li(p())))).toBeTruthy();
    });
    it('it should return false for non-empty unordered', () => {
      expect(checkEmptyNode(ul(li(p('A'))))).toBeFalsy();
    });

    it('it should return true for empty ordered list', () => {
      expect(checkEmptyNode(ol(li(p())))).toBeTruthy();
    });
    it('it should return false for non-empty ordered', () => {
      expect(checkEmptyNode(ol(li(p('1'))))).toBeFalsy();
    });

    it('it should return true for empty task list', () => {
      expect(checkEmptyNode(taskList()(taskItem()('')))).toBeTruthy();
    });
    it('it should return false for non-empty task list', () => {
      expect(checkEmptyNode(taskList()(taskItem()('do it!')))).toBeFalsy();
    });

    it('it should return true for empty decision list', () => {
      expect(checkEmptyNode(decisionList()(decisionItem()('')))).toBeTruthy();
    });
    it('it should return false for non-empty decision list', () => {
      expect(
        checkEmptyNode(decisionList()(decisionItem()('done!'))),
      ).toBeFalsy();
    });

    it('it should return false for any mediaGroup', () => {
      expect(
        checkEmptyNode(
          mediaGroup(media({ id: '123', type: 'file', collection: 'test' })()),
        ),
      ).toBeFalsy();
    });
    it('it should return false for any mediaSingle', () => {
      expect(
        checkEmptyNode(
          mediaSingle()(
            media({ id: '123', type: 'file', collection: 'test' })(),
          ),
        ),
      ).toBeFalsy();
    });

    it('it should return true for empty doc', () => {
      expect(checkEmptyNode(doc(p('')))).toBeTruthy();
    });
    it('it should return true for empty doc with empty panel', () => {
      expect(checkEmptyNode(doc(panel()(p(''))))).toBeTruthy();
    });
    it('it should return true for empty doc with empty heading', () => {
      expect(checkEmptyNode(doc(panel()(h1())))).toBeTruthy();
    });
    it('it should return true for empty doc with multiple empty blocks', () => {
      expect(
        checkEmptyNode(
          doc(panel()(p('')), h1(), code_block()(), ul(li(p('')))),
        ),
      ).toBeTruthy();
    });

    it('it should return false for non-empty doc', () => {
      expect(checkEmptyNode(doc(p('hello')))).toBeFalsy();
    });
    it('it should return false for non-empty doc', () => {
      expect(checkEmptyNode(doc(p(''), h1('Hey!')))).toBeFalsy();
    });
    it('it should return false for non-empty doc with multiple empty blocks', () => {
      expect(
        checkEmptyNode(
          doc(p('?'), panel()(p('')), h1(), code_block()(), ul(li(p()))),
        ),
      ).toBeFalsy();
    });

    it('it should throw for unknown nodes', () => {
      expect(() =>
        checkEmptyNode((() =>
          ({
            type: {
              name: 'unknown',
            },
          } as any)) as any),
      ).toThrow('unknown node is not implemented');
    });
  });
});
