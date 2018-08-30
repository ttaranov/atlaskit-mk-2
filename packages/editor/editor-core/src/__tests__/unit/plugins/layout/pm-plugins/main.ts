import { EditorState, TextSelection, PluginSpec } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  layoutSection,
  layoutColumn,
  defaultSchema,
  doc,
  p,
  RefsNode,
  hr,
  createEditor,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import {
  default as layoutPlugin,
  pluginKey,
  enforceLayoutColumnConstraints,
} from '../../../../../plugins/layout/pm-plugins/main';

const editor = doc =>
  createEditor({ doc, editorProps: { allowLayouts: true } });
const toState = (node: RefsNode) =>
  EditorState.create({
    doc: node,
    selection: node.refs['<>']
      ? TextSelection.create(node, node.refs['<>'])
      : undefined,
  });

describe('layout', () => {
  describe('plugin', () => {
    describe('#init', () => {
      it('should set pos when selection in layout', () => {
        const document = doc(
          layoutSection({ layoutType: 'two_equal' })(
            layoutColumn(p('{<>}')),
            layoutColumn(p('')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pluginState = (layoutPlugin.spec as PluginSpec).state!.init(
          {},
          state,
        );
        expect(pluginState).toEqual({ pos: 0 });
      });
      it('should set pos to null when selection is not in layout', () => {
        const document = doc(p('{<>}'))(defaultSchema);
        const state = toState(document);
        const pluginState = (layoutPlugin.spec as PluginSpec).state!.init(
          {},
          state,
        );
        expect(pluginState).toEqual({ pos: null });
      });
    });

    describe('#apply', () => {
      it('should set pos when selection in layout', () => {
        const {
          editorView,
          refs: { layoutPos },
        } = editor(
          doc(
            p('{<>}'),
            layoutSection({ layoutType: 'two_equal' })(
              layoutColumn(p('{layoutPos}')),
              layoutColumn(p('')),
            ),
          ),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, layoutPos),
          ),
        );
        expect(pluginKey.getState(editorView.state)).toEqual({
          pos: 2,
        });
      });
      it('should set pos to null when selection is not in layout', () => {
        const {
          editorView,
          refs: { pPos },
        } = editor(
          doc(
            p('{pPos}'),
            layoutSection({ layoutType: 'two_equal' })(
              layoutColumn(p('{<>}')),
              layoutColumn(p('')),
            ),
          ),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, pPos),
          ),
        );
        expect(pluginKey.getState(editorView.state)).toEqual({
          pos: null,
        });
      });
    });

    describe('#decorations', () => {
      it('should render a Node decoration when cursor inside layout', () => {
        const { editorView } = editor(
          doc(
            layoutSection({ layoutType: 'two_equal' })(
              layoutColumn(p('{<>}')),
              layoutColumn(p('')),
            ),
          ),
        );

        const decorations = (layoutPlugin.spec as PluginSpec).props!
          .decorations!(editorView.state) as DecorationSet;
        expect(decorations.find()).toHaveLength(1);
        expect(decorations.find()).toEqual([
          Decoration.node(0, 10, { class: 'selected' }),
        ]);
      });

      it('should render no decorations when cursor is outside layout', () => {
        const { editorView } = editor(doc(p('{<>}')));

        const decorations = (layoutPlugin.spec as PluginSpec).props!
          .decorations!(editorView.state) as DecorationSet;
        expect(decorations).toBeUndefined();
      });
    });

    describe('#keymaps', () => {
      describe('Tab', () => {
        it('should move to the next column', () => {
          const {
            editorView,
            refs: { secondColumnPos },
          } = editor(
            doc(
              layoutSection({ layoutType: 'two_equal' })(
                layoutColumn(p('content{<>}')),
                layoutColumn(p('{secondColumnPos}content')),
              ),
            ),
          );
          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.selection).toEqual(
            TextSelection.create(editorView.state.doc, secondColumnPos),
          );
        });

        it('should not do anything when in the last column', () => {
          const { editorView, sel } = editor(
            doc(
              layoutSection({ layoutType: 'two_equal' })(
                layoutColumn(p('')),
                layoutColumn(p('content{<>}')),
              ),
              p(''),
            ),
          );
          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.selection).toEqual(
            TextSelection.create(editorView.state.doc, sel),
          );
        });
      });
    });
  });
  describe('#enforceLayoutColumnConstraints', () => {
    ['two-equal', 'two-left-sidebar', 'two-right-sidebar'].forEach(
      layoutType => {
        it(`should merge the third column when layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Mi{<>}ddle')),
              layoutColumn(p('Last')),
            ),
          )(defaultSchema);
          const state = toState(document);
          const newState = state.apply(enforceLayoutColumnConstraints(state)!);
          expect(newState.doc).toEqualDocument(
            doc(
              layoutSection({ layoutType })(
                layoutColumn(p('First')),
                layoutColumn(p('Middle'), p('Last')),
              ),
            ),
          );
          expect(newState.selection.from).toBe(document.refs['<>']);
        });

        it(`should keep selection after merging third column when layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('La{<>}st')),
            ),
          )(defaultSchema);
          const state = toState(document);
          const newState = state.apply(enforceLayoutColumnConstraints(state)!);
          const expectedDocument = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle'), p('La{<>}st')),
            ),
          )(defaultSchema);
          expect(newState.doc).toEqualDocument(expectedDocument);
          expect(newState.selection.from).toBe(expectedDocument.refs['<>']);
        });

        it(`should keep selection after merging empty third column when layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('{<>}')),
            ),
          )(defaultSchema);
          const state = toState(document);
          const newState = state.apply(enforceLayoutColumnConstraints(state)!);
          const expectedDocument = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle{<>}')),
            ),
          )(defaultSchema);
          expect(newState.doc).toEqualDocument(expectedDocument);
          expect(newState.selection.from).toBe(expectedDocument.refs['<>']);
        });

        it(`should should drop the third column when empty and layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Mi{<>}ddle')),
              layoutColumn(p('')),
            ),
          )(defaultSchema);
          const state = toState(document);
          const newState = state.apply(enforceLayoutColumnConstraints(state)!);
          expect(newState.doc).toEqualDocument(
            doc(
              layoutSection({ layoutType })(
                layoutColumn(p('First')),
                layoutColumn(p('Middle')),
              ),
            ),
          );
          expect(newState.selection.from).toBe(document.refs['<>']);
        });

        it(`should handle multiple merges when layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('Last')),
            ),
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Mid{<>}dle'), hr()),
              layoutColumn(p('Last')),
            ),
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('Last')),
            ),
          )(defaultSchema);

          const state = toState(document);
          const tr = enforceLayoutColumnConstraints(state)!;
          const newState = state.apply(tr);

          expect(newState.doc).toEqualDocument(
            doc(
              layoutSection({ layoutType })(
                layoutColumn(p('First')),
                layoutColumn(p('Middle'), p('Last')),
              ),
              layoutSection({ layoutType })(
                layoutColumn(p('First')),
                layoutColumn(p('Middle'), hr(), p('Last')),
              ),
              layoutSection({ layoutType })(
                layoutColumn(p('First')),
                layoutColumn(p('Middle'), p('Last')),
              ),
            ),
          );
          expect(newState.selection.from).toBe(
            tr.mapping.map(document.refs['<>']),
          );
        });

        it(`should not add a third column when layout is ${layoutType}`, () => {
          const document = doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Last')),
            ),
          )(defaultSchema);
          const state = toState(document);
          expect(enforceLayoutColumnConstraints(state)).toBeUndefined();
        });
      },
    );
    ['three-equal', 'three-with-sidebars'].forEach(layoutType => {
      it(`should not merge the third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection({ layoutType })(
            layoutColumn(p('First')),
            layoutColumn(p('Middle')),
            layoutColumn(p('Last')),
          ),
        )(defaultSchema);
        const state = toState(document);
        expect(enforceLayoutColumnConstraints(state)!).toBeUndefined();
      });

      it(`should add a third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection({ layoutType })(
            layoutColumn(p('First')),
            layoutColumn(p('Mid{<>}dle')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const newState = state.apply(enforceLayoutColumnConstraints(state)!);
        expect(newState.doc).toEqualDocument(
          doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('')),
            ),
          ),
        );
        expect(newState.selection.from).toBe(document.refs['<>']);
      });

      it(`should handle adding a third column multiple times when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection({ layoutType })(
            layoutColumn(p('First')),
            layoutColumn(p('Middle')),
          ),
          layoutSection({ layoutType })(
            layoutColumn(p('First')),
            layoutColumn(p('Mid{<>}dle'), hr()),
          ),
          layoutSection({ layoutType })(
            layoutColumn(p('First')),
            layoutColumn(p('Middle')),
          ),
        )(defaultSchema);

        const state = toState(document);
        const tr = enforceLayoutColumnConstraints(state)!;
        const newState = state.apply(tr);

        expect(newState.doc).toEqualDocument(
          doc(
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('')),
            ),
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle'), hr()),
              layoutColumn(p('')),
            ),
            layoutSection({ layoutType })(
              layoutColumn(p('First')),
              layoutColumn(p('Middle')),
              layoutColumn(p('')),
            ),
          ),
        );
        expect(newState.selection.from).toBe(
          tr.mapping.map(document.refs['<>']),
        );
      });
    });
  });
});
