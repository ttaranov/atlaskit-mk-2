import { Node, Fragment, Slice } from 'prosemirror-model';
import {
  defaultSchema,
  doc,
  p,
  layoutSection,
  layoutColumn,
  hr,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import {
  flatmap,
  unwrapContentFromLayout,
  removeLayoutFromFirstChild,
  removeLayoutFromLastChild,
  removeLayoutFromAllChildren,
  transformSliceToRemoveOpenLayoutNodes,
  removeLayoutsIfSelectionIsInLayout,
} from '../../../src/plugins/layout/utils';

const array = (...args): Node[] => args.map(i => i(defaultSchema));
const fragment = (...args) => Fragment.from(args.map(i => i(defaultSchema)));

describe('layout', () => {
  describe('#flatmap', () => {
    it('should return an equal fragment when the callback is an identity fn', () => {
      const content = fragment(p('hello'), p('world'), p('!'));
      expect(flatmap(content, n => n).eq(content)).toBe(true);
    });

    it('should invoke the callback fn with the node, index & original fragment', () => {
      const content = fragment(p('hello'), p('world'), p('!'));
      const callbackSpy = jest.fn(i => i);

      flatmap(content, callbackSpy);
      expect(callbackSpy).toHaveBeenCalledTimes(3);
      callbackSpy.mock.calls.forEach(args => {
        expect(args[0]).toBeInstanceOf(Node);
        expect(typeof args[1]).toBe('number');
        expect(args[2]).toEqual(content);
      });
    });

    it('should flatten any array returned from the callback fn', () => {
      const content = fragment(p('hello'), p('world'), p('!'));

      const actualFragment = flatmap(content, n => [n, n]);
      const expected = fragment(
        p('hello'),
        p('hello'),
        p('world'),
        p('world'),
        p('!'),
        p('!'),
      );
      expect(actualFragment.eq(expected)).toBe(true);
    });
  });

  describe('#unwrapContentFromLayout', () => {
    it('should ignore any node that is not a layoutSection', () => {
      const node = p('hello world!')(defaultSchema);
      expect(unwrapContentFromLayout(node)).toBe(node);
    });

    it('should unwrap any content inside a layoutSection', () => {
      const columnA = layoutColumn(p('Column A'), hr());
      const columnB = layoutColumn(p('Column B'));
      const columnC = layoutColumn(hr(), p('Column C'), hr());
      const layout = layoutSection()(columnA, columnB, columnC)(defaultSchema);

      const expected = array(
        p('Column A'),
        hr(),
        p('Column B'),
        hr(),
        p('Column C'),
        hr(),
      );
      expect(unwrapContentFromLayout(layout)).toEqual(expected);
    });
  });

  describe('#removeLayoutFromFirstChild', () => {
    it('should unwrap the layout when it is the first child of a node', () => {
      const columnA = layoutColumn(p('Column A'));
      const columnB = layoutColumn(p('Column B'));
      const layout = layoutSection()(columnA, columnB)(defaultSchema);

      const expected = array(p('Column A'), p('Column B'));
      expect(removeLayoutFromFirstChild(layout, 0)).toEqual(expected);
    });

    it('should do nothing when the layout is not the first child of a node', () => {
      const columnA = layoutColumn(p('Column A'));
      const columnB = layoutColumn(p('Column B'));
      const layout = layoutSection()(columnA, columnB)(defaultSchema);
      expect(removeLayoutFromFirstChild(layout, 1)).toEqual(layout);
    });
  });

  describe('#removeLayoutFromLastChild', () => {
    it('should unwrap the layout when it is the last child of a node', () => {
      const columnA = layoutColumn(p('Column A'));
      const columnB = layoutColumn(p('Column B'));
      const layout = layoutSection()(columnA, columnB);
      const sliceFragment = fragment(p('Start'), layout);

      const expected = array(p('Column A'), p('Column B'));
      expect(
        removeLayoutFromLastChild(
          sliceFragment.lastChild!,
          sliceFragment.childCount - 1,
          sliceFragment,
        ),
      ).toEqual(expected);
    });

    it('should do nothing when the layout is not the last child of a node', () => {
      const columnA = layoutColumn(p('Column A'));
      const columnB = layoutColumn(p('Column B'));
      const layout = layoutSection()(columnA, columnB);
      const sliceFragment = fragment(p('Start'), layout, p('End'));

      expect(
        removeLayoutFromLastChild(sliceFragment.child(1), 1, sliceFragment),
      ).toEqualDocument(layout);
    });
  });

  describe('#removeLayoutFromAllChildren', () => {
    it('should unwrap a layout regardless of position', () => {
      const columnA = layoutColumn(p('Column A'));
      const columnB = layoutColumn(p('Column B'));
      const layout = layoutSection()(columnA, columnB)(defaultSchema);

      const expected = array(p('Column A'), p('Column B'));
      expect(removeLayoutFromAllChildren(layout)).toEqual(expected);
    });
  });

  describe('#transformSliceToRemoveOpenLayoutNodes', () => {
    describe('when a slice contains only one layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
          ),
          3,
          3,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(new Slice(fragment(p('Column A'), p('Column B')), 1, 1));
      });
    });
    describe('when a slice begins with a layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
            p('End'),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
            p('End'),
          ),
          3,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(fragment(p('Column A'), p('Column B'), p('End')), 1, 0),
        );
      });
    });
    describe('when a slice ends with a layoutSection', () => {
      it('should ignore the layoutSection if the node is closed', () => {
        const slice = new Slice(
          fragment(
            p('Start'),
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
          ),
          0,
          0,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the node is open', () => {
        const slice = new Slice(
          fragment(
            p('Start'),
            layoutSection()(
              layoutColumn(p('Column A')),
              layoutColumn(p('Column B')),
            ),
          ),
          0,
          3,
        );
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(fragment(p('Start'), p('Column A'), p('Column B')), 0, 1),
        );
      });
    });

    describe('when a slice starts in one layoutSection and ends in another', () => {
      it('should ignore the layoutSection if the slice is closed', () => {
        const layout = layoutSection()(
          layoutColumn(p('Column A')),
          layoutColumn(p('Column B')),
        );
        const slice = new Slice(fragment(layout, p('Middle'), layout), 0, 0);
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toBe(slice);
      });

      it('should unwrap the layoutSection if the slice is open', () => {
        const layout = layoutSection()(
          layoutColumn(p('Column A')),
          layoutColumn(p('Column B')),
        );
        const slice = new Slice(fragment(layout, p('Middle'), layout), 3, 3);
        expect(
          transformSliceToRemoveOpenLayoutNodes(slice, defaultSchema),
        ).toEqual(
          new Slice(
            fragment(
              p('Column A'),
              p('Column B'),
              p('Middle'),
              p('Column A'),
              p('Column B'),
            ),
            1,
            1,
          ),
        );
      });
    });
  });

  describe('#removeLayoutsIfSelectionIsInLayout', () => {
    it('should return the original slice if selection is not inside a layout', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: { allowLayouts: true },
      });
      const slice = new Slice(
        fragment(
          p('Start'),
          layoutSection()(layoutColumn(p('Middle')), layoutColumn(p('Column'))),
          p('End'),
        ),
        0,
        0,
      );
      expect(removeLayoutsIfSelectionIsInLayout(slice, editorView.state)).toBe(
        slice,
      );
    });

    it('should unwrap the contents of all layouts if selection is inside a layout', () => {
      const { editorView } = createEditor({
        doc: doc(
          layoutSection()(
            layoutColumn(p('Hello{<>}')),
            layoutColumn(p('World')),
          ),
        ),
        editorProps: { allowLayouts: true },
      });
      const slice = new Slice(
        fragment(
          p('Start'),
          layoutSection()(layoutColumn(p('Middle')), layoutColumn(p('Column'))),
          p('End'),
        ),
        0,
        0,
      );
      expect(
        removeLayoutsIfSelectionIsInLayout(slice, editorView.state),
      ).toEqual(
        new Slice(
          fragment(p('Start'), p('Middle'), p('Column'), p('End')),
          0,
          0,
        ),
      );
    });
  });
});
