//@flow
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import type { DropResult, DragUpdate, DragStart } from 'react-beautiful-dnd';
import { getBox } from 'css-box-model';
import Tree from '../../Tree';
import { treeWithThreeLeaves } from '../../../../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../../../../mockdata/treeWithTwoBranches';

configure({ adapter: new Adapter() });

const dragStart: DragStart = {
  draggableId: '1-1',
  type: 'any',
  source: {
    droppableId: 'list',
    index: 1,
  },
};

const dragUpdate: DragUpdate = {
  ...dragStart,
  destination: {
    droppableId: 'list',
    index: 4,
  },
};

const dropResult: DropResult = {
  ...dragUpdate,
  reason: 'DROP',
};

jest.mock('css-box-model');

describe('@atlaskit/tree - Tree', () => {
  const mockRender = jest.fn(({ provided }) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      Draggable
    </div>
  ));

  beforeEach(() => {
    mockRender.mockClear();
  });

  describe('#render', () => {
    it('renders a flat list using renderItem', () => {
      mount(<Tree tree={treeWithThreeLeaves} renderItem={mockRender} />);
      expect(mockRender).toHaveBeenCalledTimes(3);
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-1'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-2'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-3'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
    });

    it('re-renders only the items which have been changed', () => {
      const wrapper = mount(
        <Tree tree={treeWithThreeLeaves} renderItem={mockRender} />,
      );
      expect(mockRender).toHaveBeenCalledTimes(3);
      mockRender.mockClear();
      const mutatedTree = {
        rootId: treeWithThreeLeaves.rootId,
        items: {
          ...treeWithThreeLeaves.items,
          '1-3': {
            ...treeWithThreeLeaves.items['1-3'],
          },
        },
      };
      wrapper.setProps({ tree: mutatedTree, renderItem: mockRender });
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender).toBeCalledWith({
        item: mutatedTree.items['1-3'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
    });
  });

  describe('#onExpand', () => {
    it('calls with the right item', () => {
      const mockOnExpand = jest.fn();
      const firstItem = treeWithThreeLeaves.items['1-1'];
      mount(
        <Tree
          tree={treeWithThreeLeaves}
          renderItem={mockRender}
          onExpand={mockOnExpand}
        />,
      );
      mockRender.mock.calls[0][0].onExpand(firstItem);
      expect(mockOnExpand).toHaveBeenCalledTimes(1);
      expect(mockOnExpand).toBeCalledWith(firstItem, [0]);
    });
  });

  describe('#onCollapse', () => {
    it('calls with the right item', () => {
      const mockOnCollapse = jest.fn();
      const firstItem = treeWithThreeLeaves.items['1-1'];
      mount(
        <Tree
          tree={treeWithThreeLeaves}
          renderItem={mockRender}
          onCollapse={mockOnCollapse}
        />,
      );
      mockRender.mock.calls[0][0].onCollapse(firstItem);
      expect(mockOnCollapse).toHaveBeenCalledTimes(1);
      expect(mockOnCollapse).toBeCalledWith(firstItem, [0]);
    });
  });

  describe('#onDragStart', () => {
    it('saves the draggedItemId and source', () => {
      const instance = mount(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      expect(instance.dragState).toEqual({
        draggedItemId: dragStart.draggableId,
        source: dragStart.source,
        destination: dragStart.source,
      });
    });
    it('calls onDragStart if it is defined', () => {
      const mockOnStartCb = jest.fn();
      const instance = mount(
        <Tree
          tree={treeWithTwoBranches}
          renderItem={mockRender}
          onDragStart={mockOnStartCb}
        />,
      ).instance();
      instance.onDragStart(dragStart);
      expect(mockOnStartCb).toHaveBeenCalledTimes(1);
      expect(mockOnStartCb).toHaveBeenCalledWith('1-1');
    });
  });

  describe('#onDragEnd', () => {
    it('calls props.onDragEnd when drag ends successfully', () => {
      const mockOnDragEnd = jest.fn();
      const instance = mount(
        <Tree
          tree={treeWithTwoBranches}
          renderItem={mockRender}
          onDragEnd={mockOnDragEnd}
        />,
      ).instance();
      instance.onDragEnd(dropResult);
      expect(mockOnDragEnd).toHaveBeenCalledTimes(1);
      expect(mockOnDragEnd).toBeCalledWith(
        { parentId: '1-1', index: 0 },
        { parentId: '1-2', index: 1 },
      );
    });
  });

  describe('#onDragUpdate', () => {
    it('updates dragState', () => {
      const instance = mount(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onDragUpdate(dragUpdate);
      expect(instance.dragState).toEqual({
        draggedItemId: dragUpdate.draggableId,
        source: dragUpdate.source,
        destination: dragUpdate.destination,
      });
    });
  });

  describe('#onPointerMove', () => {
    it('calculates horizontal level based on the horizontal position', () => {
      // $ExpectError: mockReturnValue is missing in function
      getBox.mockReturnValue({
        contentBox: {
          left: 120,
        },
        borderBox: {
          left: 120,
        },
      });
      const instance = mount(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onPointerMove();
      expect(instance.dragState).toEqual({
        draggedItemId: dragStart.draggableId,
        source: dragStart.source,
        destination: dragStart.source,
        horizontalLevel: 1,
      });
    });
  });
});
