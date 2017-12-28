import { browser } from '@atlaskit/editor-common';
import listsPlugins, { ListsState } from '../../../src/plugins/lists';
import {
  makeEditor,
  sendKeyToPm,
  doc,
  ol,
  ul,
  li,
  p,
  panel,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import { createPlugin as createSaveOnEnterPlugin } from '../../../src/editor/plugins/save-on-enter';
import { analyticsService } from '../../../src/analytics';

describe('lists - keymap', () => {
  const editor = (doc: any) =>
    makeEditor<ListsState>({
      doc,
      plugins: listsPlugins(defaultSchema),
    });

  describe('keymap', () => {
    let trackEvent;
    beforeEach(() => {
      trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
    });

    describe('when hit enter', () => {
      it('should split list item', () => {
        const { editorView } = editor(doc(ul(li(p('text{<>}')))));
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('text')), li(p()))),
        );
      });
    });

    describe('when hit Tab', () => {
      it('should call indent analytics event', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('text{<>}')))),
        );
        sendKeyToPm(editorView, 'Tab');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.format.list.indent.keyboard',
        );
      });
    });

    describe('when hit Shift-Tab', () => {
      it('should call outdent analytics event', () => {
        const { editorView } = editor(
          doc(ol(li(p('One'), ul(li(p('Two{<>}')))))),
        );
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.format.list.outdent.keyboard',
        );
      });
    });

    describe('In message editor', () => {
      const messageEditor = (doc: any) =>
        makeEditor({
          doc,
          plugins: [
            createSaveOnEnterPlugin(() => {})!,
            ...listsPlugins(defaultSchema, 'message'),
          ],
        });

      describe('when hit shift+enter', () => {
        it('should split list item', () => {
          const { editorView } = messageEditor(doc(ul(li(p('text{<>}')))));
          sendKeyToPm(editorView, 'Shift-Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(ul(li(p('text')), li(p()))),
          );
        });
      });

      describe('when hit enter', () => {
        it('should not split list item', () => {
          const { editorView } = messageEditor(doc(ul(li(p('text{<>}')))));
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
        });
      });
    });

    if (browser.mac) {
      describe('when on a mac', () => {
        describe('when hit Cmd-Alt-7', () => {
          it('should toggle ordered list', () => {
            const { editorView } = editor(doc(p('text{<>}')));
            sendKeyToPm(editorView, 'Cmd-Alt-7');
            expect(editorView.state.doc).toEqualDocument(
              doc(ol(li(p('text')))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.list.numbered.keyboard',
            );
          });
        });

        describe('when hit Cmd-Alt-8', () => {
          it('should toggle bullet list', () => {
            const { editorView } = editor(doc(p('text{<>}')));
            sendKeyToPm(editorView, 'Cmd-Alt-8');
            expect(editorView.state.doc).toEqualDocument(
              doc(ul(li(p('text')))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.list.bullet.keyboard',
            );
          });
        });
      });
    }
  });

  describe('KeyMap in Nested Lists', () => {
    it('should increase the depth of list item when Tab key press', () => {
      const { editorView } = editor(
        doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
      );
      expect(editorView.state.selection.$from.depth).toEqual(3);

      sendKeyToPm(editorView, 'Tab');

      expect(editorView.state.selection.$from.depth).toEqual(5);
    });

    it('should nest the list item when Tab key press', () => {
      const { editorView } = editor(
        doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
      );

      sendKeyToPm(editorView, 'Tab');

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
      );
    });

    it('should decrease the depth of list item when Shift-Tab key press', () => {
      const { editorView } = editor(
        doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
      );
      expect(editorView.state.selection.$from.depth).toEqual(5);

      sendKeyToPm(editorView, 'Shift-Tab');

      expect(editorView.state.selection.$from.depth).toEqual(3);
    });

    it('should lift the list item when Shift-Tab key press', () => {
      const { editorView } = editor(
        doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
      );

      sendKeyToPm(editorView, 'Shift-Tab');

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
      );
    });

    it('should lift the list item when Enter key press is done on empty list-item', () => {
      const { editorView } = editor(
        doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
      );

      sendKeyToPm(editorView, 'Enter');

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
      );
    });
  });

  describe('Enter key-press', () => {
    describe('when Enter key is pressed on empty nested list item', () => {
      it('should create new list item in parent list', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
        );
      });
    });

    describe('when Enter key is pressed on non-empty nested list item', () => {
      it('should created new nested list item', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('test{<>}')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('text'), ol(li(p('test')), li(p('{<>}')))), li(p('text'))),
          ),
        );
      });
    });

    describe('when Enter key is pressed on non-empty top level list item', () => {
      it('should created new list item at top level', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('test{<>}')), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text')))),
        );
      });
    });

    describe('when Enter key is pressed on non-empty top level list item inside panel', () => {
      it('should created new list item at top level', () => {
        const { editorView } = editor(
          doc(panel(ol(li(p('text')), li(p('test{<>}')), li(p('text'))))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(
            panel(
              ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text'))),
            ),
          ),
        );
      });
    });

    describe('when Enter key is pressed on empty top level list item', () => {
      it('should create new paragraph outside the list', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
        );
      });
    });

    describe('when Enter key is pressed on empty top level list item inside panel', () => {
      it('should create new paragraph outside the list', () => {
        const { editorView } = editor(
          doc(panel(ol(li(p('text')), li(p('{<>}')), li(p('text'))))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(panel(ol(li(p('text'))), p('{<>}'), ol(li(p('text'))))),
        );
      });
    });
  });
});
