//@flow
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { type DropResult, type DragUpdate } from 'react-beautiful-dnd';
import Tree from '../../Tree';
import { treeWithThreeLeaves } from '../../../../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../../../../mockdata/treeWithTwoBranches';
import { complexTree } from '../../../../../mockdata/complexTree';

configure({ adapter: new Adapter() });

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

  describe('#onDragEnd', () => {
    it('calls props.onDragEnd when drag ends successfully', () => {
      const mockOnDragEnd = jest.fn();
      const dropResult: DropResult = {
        draggableId: '1-1',
        type: 'any',
        source: {
          droppableId: 'list',
          index: 1,
        },
        destination: {
          droppableId: 'list',
          index: 4,
        },
        reason: 'DROP',
      };
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
    it('should set offset 0 if not necessary', () => {
      const dropUpdate: DragUpdate = {
        draggableId: '1-1',
        type: 'any',
        source: {
          droppableId: 'list',
          index: 4,
        },
        destination: {
          droppableId: 'list',
          index: 4,
        },
      };
      const instance = mount(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragUpdate(dropUpdate);
      expect(instance.state.dropAnimationOffset).toBe(0);
    });

    it('should set offset 35 if the last displaced item is on the different level as the dragged item will be', () => {
      const dropUpdate: DragUpdate = {
        draggableId: '1-1',
        type: 'any',
        source: {
          droppableId: 'list',
          index: 1,
        },
        destination: {
          droppableId: 'list',
          index: 2,
        },
      };
      const instance = mount(
        <Tree tree={complexTree} renderItem={mockRender} />,
      ).instance();
      instance.onDragUpdate(dropUpdate);
      expect(instance.state.dropAnimationOffset).toBe(35);
    });
  });
});
