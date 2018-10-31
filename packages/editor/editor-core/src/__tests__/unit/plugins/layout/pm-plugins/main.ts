import { EditorState, TextSelection, PluginSpec } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import {
  layoutSection,
  layoutColumn,
  defaultSchema,
  doc,
  p,
  RefsNode,
  createEditor,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import {
  default as layoutPlugin,
  pluginKey,
} from '../../../../../plugins/layout/pm-plugins/main';
import {
  forceSectionToPresetLayout,
  PresetLayout,
} from '../../../../../plugins/layout/actions';
import { Node } from 'prosemirror-model';

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
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
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
            layoutSection(
              layoutColumn({ width: 50 })(p('{layoutPos}')),
              layoutColumn({ width: 50 })(p('')),
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
            layoutSection(
              layoutColumn({ width: 50 })(p('{<>}')),
              layoutColumn({ width: 50 })(p('')),
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
            layoutSection(
              layoutColumn({ width: 50 })(p('{<>}')),
              layoutColumn({ width: 50 })(p('')),
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
              layoutSection(
                layoutColumn({ width: 50 })(p('content{<>}')),
                layoutColumn({ width: 50 })(p('{secondColumnPos}content')),
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
              layoutSection(
                layoutColumn({ width: 50 })(p('')),
                layoutColumn({ width: 50 })(p('content{<>}')),
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
  describe('#forceSectionToPresetLayout', () => {
    ['two_equal'].forEach((layoutType: PresetLayout) => {
      it(`should merge the third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('First')),
            layoutColumn({ width: 33.33 })(p('Mi{<>}ddle')),
            layoutColumn({ width: 33.33 })(p('Last')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        const newState = state.apply(
          forceSectionToPresetLayout(state, node, pos, layoutType)!,
        );
        expect(newState.doc).toEqualDocument(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(p('First')),
              layoutColumn({ width: 50 })(p('Middle'), p('Last')),
            ),
          ),
        );
        expect(newState.selection.from).toBe(document.refs['<>']);
      });

      it(`should keep selection after merging third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('First')),
            layoutColumn({ width: 33.33 })(p('Middle')),
            layoutColumn({ width: 33.33 })(p('La{<>}st')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        const newState = state.apply(
          forceSectionToPresetLayout(state, node, pos, layoutType)!,
        );
        const expectedDocument = doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('First')),
            layoutColumn({ width: 50 })(p('Middle'), p('La{<>}st')),
          ),
        )(defaultSchema);
        expect(newState.doc).toEqualDocument(expectedDocument);
        expect(newState.selection.from).toBe(expectedDocument.refs['<>']);
      });

      it(`should keep selection after merging empty third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('First')),
            layoutColumn({ width: 33.33 })(p('Middle')),
            layoutColumn({ width: 33.33 })(p('{<>}')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        const newState = state.apply(
          forceSectionToPresetLayout(state, node, pos, layoutType)!,
        );
        const expectedDocument = doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('First')),
            layoutColumn({ width: 50 })(p('Middle{<>}')),
          ),
        )(defaultSchema);
        expect(newState.doc).toEqualDocument(expectedDocument);
        expect(newState.selection.from).toBe(expectedDocument.refs['<>']);
      });

      it(`should should drop the third column when empty and layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('First')),
            layoutColumn({ width: 33.33 })(p('Mi{<>}ddle')),
            layoutColumn({ width: 33.33 })(p('')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        const newState = state.apply(
          forceSectionToPresetLayout(state, node, pos, layoutType)!,
        );
        expect(newState.doc).toEqualDocument(
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(p('First')),
              layoutColumn({ width: 50 })(p('Middle')),
            ),
          ),
        );
        expect(newState.selection.from).toBe(document.refs['<>']);
      });

      it(`should not add a third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('First')),
            layoutColumn({ width: 50 })(p('Last')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        expect(
          forceSectionToPresetLayout(state, node, pos, layoutType).docChanged,
        ).toBe(false);
      });
    });
    ['three_equal'].forEach((layoutType: PresetLayout) => {
      it(`should not merge the third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('First')),
            layoutColumn({ width: 33.33 })(p('Middle')),
            layoutColumn({ width: 33.33 })(p('Last')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        expect(
          forceSectionToPresetLayout(state, node, pos, layoutType).docChanged,
        ).toBe(false);
      });

      it(`should add a third column when layout is ${layoutType}`, () => {
        const document = doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('First')),
            layoutColumn({ width: 50 })(p('Mid{<>}dle')),
          ),
        )(defaultSchema);
        const state = toState(document);
        const pos = 0;
        const node = document.nodeAt(pos) as Node;
        const newState = state.apply(
          forceSectionToPresetLayout(state, node, pos, layoutType)!,
        );
        expect(newState.doc).toEqualDocument(
          doc(
            layoutSection(
              layoutColumn({ width: 33.33 })(p('First')),
              layoutColumn({ width: 33.33 })(p('Middle')),
              layoutColumn({ width: 33.33 })(p('')),
            ),
          ),
        );
        expect(newState.selection.from).toBe(document.refs['<>']);
      });
    });
  });
  describe('appendTransaction', () => {
    it(`ensure all column sizes add to 100%`, () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('Over')),
            layoutColumn({ width: 33.33 })(p('Fl{<>}ow')),
            layoutColumn({ width: 50 })(p('Column')),
          ),
        ),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('Over')),
            layoutColumn({ width: 33.33 })(p('Flow')),
            layoutColumn({ width: 33.33 })(p('Column')),
          ),
        ),
      );
    });
  });
});
