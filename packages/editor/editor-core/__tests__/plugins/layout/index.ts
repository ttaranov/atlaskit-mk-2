import { EditorState, TextSelection } from 'prosemirror-state';
import {
  layoutSection,
  layoutColumn,
  defaultSchema,
  doc,
  p,
  RefsNode,
  hr,
} from '@atlaskit/editor-test-helpers';
import { enforceLayoutColumnConstraints } from '../../../src/plugins/layout';

const toState = (node: RefsNode) =>
  EditorState.create({
    doc: node,
    selection: node.refs['<>']
      ? TextSelection.create(node, node.refs['<>'])
      : undefined,
  });

describe('layout', () => {
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
