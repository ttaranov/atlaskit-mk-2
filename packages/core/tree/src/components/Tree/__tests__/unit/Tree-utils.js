//@flow
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { complexTree } from '../../../../../mockdata/complexTree';
import { calculatePendingDropAnimatingOffset } from '../../Tree-utils';
import { flattenTree } from '../../../../utils/tree';
import { type DragState } from '../../Tree-types';

configure({ adapter: new Adapter() });
const flatComplextTree = flattenTree(complexTree);

describe('@atlaskit/tree - Tree-utils', () => {
  describe('#calculatePendingDropAnimatingOffset', () => {
    it('return 0 if no offset is needed ', () => {
      const dragState: DragState = {
        draggedItemId: '1-0',
        source: {
          droppableId: 'whatever',
          index: 0,
        },
        destination: {
          droppableId: 'whatever',
          index: 1,
        },
      };
      expect(
        calculatePendingDropAnimatingOffset(flatComplextTree, dragState, 35),
      ).toBe(0);
    });
    it('returns offset needed to fix drop animation when moved down to top of subtree', () => {
      const dragState: DragState = {
        draggedItemId: '1-0',
        source: {
          droppableId: 'whatever',
          index: 0,
        },
        destination: {
          droppableId: 'whatever',
          index: 2,
        },
      };
      expect(
        calculatePendingDropAnimatingOffset(flatComplextTree, dragState, 35),
      ).toBe(35);
    });

    it('returns offset needed to fix drop animation when moved up to the end of subtree', () => {
      const dragState: DragState = {
        draggedItemId: '1-6-0',
        source: {
          droppableId: 'whatever',
          index: 11,
        },
        destination: {
          droppableId: 'whatever',
          index: 7,
        },
      };
      expect(
        calculatePendingDropAnimatingOffset(flatComplextTree, dragState, 35),
      ).toBe(35);
    });

    it('returns offset needed to fix drop animation when moved horizontally', () => {
      const dragState: DragState = {
        draggedItemId: '1-2-3',
        source: {
          droppableId: 'whatever',
          index: 6,
        },
        destination: {
          droppableId: 'whatever',
          index: 6,
        },
        horizontalLevel: 1,
      };
      expect(
        calculatePendingDropAnimatingOffset(flatComplextTree, dragState, 35),
      ).toBe(-35);
    });
  });
});
