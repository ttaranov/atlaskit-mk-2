import listsPlugins, { ListsState } from '../../../src/plugins/lists';
import {
  makeEditor,
  doc,
  h1,
  ol,
  ul,
  li,
  p,
  panel,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { setTextSelection } from '../../../src/utils';

describe('lists', () => {
  const editor = (doc: any) =>
    makeEditor<ListsState>({
      doc,
      plugins: listsPlugins(defaultSchema),
    });

  describe('API', () => {
    it('should allow a change handler to be attached', () => {
      const { pluginState } = editor(doc(p()));
      const spy = jest.fn();

      pluginState.subscribe(spy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a change when the selected node becomes an ordered list', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));
      const spy = jest.fn();
      pluginState.subscribe(spy);

      pluginState.toggleOrderedList(editorView);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(pluginState).toHaveProperty('orderedListActive', true);
      expect(pluginState).toHaveProperty('orderedListDisabled', false);
      expect(pluginState).toHaveProperty('orderedListHidden', false);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', false);
      expect(pluginState).toHaveProperty('bulletListHidden', false);
    });

    it('should not emit extra change events when moving within an ordered list', () => {
      const { editorView, pluginState, refs } = editor(
        doc(ol(li(p('t{<>}ex{end}t')))),
      );
      const { end } = refs;

      const spy = jest.fn();
      pluginState.subscribe(spy);

      setTextSelection(editorView, end);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not emit extra change events when moving within an ordered list to the last character', () => {
      const { editorView, pluginState, refs } = editor(
        doc(ol(li(p('t{<>}ext{end}')))),
      );
      const { end } = refs;

      const spy = jest.fn();
      pluginState.subscribe(spy);

      setTextSelection(editorView, end);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit change events when the state has changed', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}ex{>}t')));
      const spy = jest.fn();
      pluginState.subscribe(spy);

      pluginState.toggleOrderedList(editorView);
      pluginState.toggleOrderedList(editorView);
      pluginState.toggleBulletList(editorView);
      pluginState.toggleBulletList(editorView);

      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('should emit change events when the state has changed with entire word selected', () => {
      const { editorView, pluginState } = editor(doc(p('{<}text{>}')));
      const spy = jest.fn();
      pluginState.subscribe(spy);

      pluginState.toggleOrderedList(editorView);
      pluginState.toggleOrderedList(editorView);
      pluginState.toggleBulletList(editorView);
      pluginState.toggleBulletList(editorView);

      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('should allow toggling between normal text and ordered list', () => {
      const { editorView, pluginState } = editor(doc(p('t{a}ex{b}t')));

      pluginState.toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('text')))));
      pluginState.toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between normal text and bullet list', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}ex{>}t')));

      pluginState.toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      pluginState.toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between ordered and bullet list', () => {
      const { editorView, pluginState } = editor(doc(ol(li(p('t{<}ex{>}t')))));

      pluginState.toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      pluginState.toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should make sure that it is enabled when selecting ordered list', () => {
      const { pluginState } = editor(doc(ol(li(p('te{<>}xt')))));

      expect(pluginState).toHaveProperty('orderedListActive', true);
      expect(pluginState).toHaveProperty('orderedListDisabled', false);
      expect(pluginState).toHaveProperty('orderedListHidden', false);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', false);
      expect(pluginState).toHaveProperty('bulletListHidden', false);
    });

    it('should be disabled when selecting h1', () => {
      const { pluginState } = editor(doc(h1('te{<>}xt')));

      expect(pluginState).toHaveProperty('orderedListActive', false);
      expect(pluginState).toHaveProperty('orderedListDisabled', true);
      expect(pluginState).toHaveProperty('orderedListHidden', false);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', true);
      expect(pluginState).toHaveProperty('bulletListHidden', false);
    });

    describe('untoggling a list', () => {
      const expectedOutput = doc(
        ol(li(p('One'))),
        p('Two'),
        p('Three'),
        ol(li(p('Four'))),
      );

      it('should allow untoggling part of a list based on selection', () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should untoggle empty paragraphs in a list', () => {
        const { editorView, pluginState } = editor(
          doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('One'), p('Two'), p(), p('Three')),
        );
      });

      it('should untoggle all list items with different ancestors in selection', () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three'))),
            ol(li(p('One{>}')), li(p('Two'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One'))),
            p('Two'),
            p('Three'),
            p('One'),
            ol(li(p('Two'))),
          ),
        );
      });
    });

    describe('converting a list', () => {
      it('should allow converting part of a list based on selection', () => {
        const expectedOutput = doc(
          ol(li(p('One'))),
          ul(li(p('Two')), li(p('Three'))),
          ol(li(p('Four'))),
        );
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection inside panel to list', () => {
        const expectedOutput = doc(panel(ul(li(p('text')))));
        const { editorView, pluginState } = editor(doc(panel(p('te{<>}xt'))));

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should allow converting part of a list based on selection that starts at the end of previous line', () => {
        const expectedOutput = doc(
          ol(li(p('One'))),
          ul(li(p('Two')), li(p('Three'))),
          ol(li(p('Four'))),
        );
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One{<}')), li(p('Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        ); // When selection starts on previous (empty) node

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView, pluginState } = editor(
          doc(p('{<}One'), ol(li(p('Two{>}')), li(p('Three')), li(p('Four')))),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView, pluginState } = editor(
          doc(p('{<}One'), ol(li(p('Two')), li(p('Three'))), p('Four{>}')),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView, pluginState } = editor(
          doc(ol(li(p('One')), li(p('{<}Two')), li(p('Three'))), p('Four{>}')),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list and keep empty paragraphs', () => {
        const expectedOutput = doc(
          ul(li(p('One')), li(p('Two')), li(p()), li(p('Three'))),
        );
        const { editorView, pluginState } = editor(
          doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to list when there is an empty paragraph between non empty two', () => {
        const expectedOutput = doc(ul(li(p('One')), li(p()), li(p('Three'))));
        const { editorView, pluginState } = editor(
          doc(p('{<}One'), p(), p('Three{>}')),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });
    });

    describe('joining lists', () => {
      const expectedOutputForPreviousList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
        ),
        p('Six'),
      );
      const expectedOutputForNextList = doc(
        p('One'),
        ol(
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );
      const expectedOutputForPreviousAndNextList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );

      it("should join with previous list if it's of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should join with previous list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should not join with previous list if it's not of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should not join with previous list if it's not of the same type and selection starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should join with next list if it's of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should join with next list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should not join with next list if it isn't of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with next list if it isn't of the same type and selection starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should join with previous and next list if they're of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should join with previous and next list if they're of the same type and selection starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should not join with previous and next list if they're not of the same type", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with previous and next list if they're not of the same type and selectoin starts at the end of previous line", () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        pluginState.toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });
    });

    describe('Toggle - nested list scenarios - to lift items out of list', () => {
      it('should be possible to toggle a simple nested list', () => {
        const { editorView, pluginState } = editor(
          doc(ol(li(p('text'), ol(li(p('text{<>}')))), li(p('text')))),
        );

        pluginState.toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('text{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle an empty nested list item', () => {
        const { editorView, pluginState } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        pluginState.toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across different depths in the list', () => {
        const { editorView, pluginState } = editor(
          doc(ol(li(p('te{<}xt'), ol(li(p('text{>}')))), li(p('text')))),
        );

        pluginState.toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('text{>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across lists with different parent lists', () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(li(p('te{<}xt'), ol(li(p('text'))))),
            ol(li(p('te{>}xt'), ol(li(p('text'))))),
          ),
        );

        pluginState.toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('text'), p('te{>}xt'), ol(li(p('text')))),
        );
      });

      it('should be create a new list for children of lifted list item', () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('te{<>}xt'), ol(li(p('text')))))),
              li(p('text')),
            ),
          ),
        );

        pluginState.toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('text'))),
            p('te{<>}xt'),
            ol(li(p('text')), li(p('text'))),
          ),
        );
      });

      it('should only change type to bullet list when toggling orderedList to bulletList', () => {
        const { editorView, pluginState } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ol(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );

        pluginState.toggleBulletList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ul(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );
      });
    });
  });
});
