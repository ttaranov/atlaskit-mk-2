//@flow
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { type DropResult, type DragUpdate } from 'react-beautiful-dnd';
import Tree from '../../src/index';
import { treeWithThreeLeaves } from '../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../mockdata/treeWithTwoBranches';
import { complexTree } from '../../mockdata/complexTree';

configure({ adapter: new Adapter() });

describe('@atlaskit/tree - Tree', () => {
  const mockRender = jest.fn();
  mockRender.mockReturnValue(<span />);

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

    it('does not call props.onDragEnd if destination is undefined', () => {
      const mockOnDragEnd = jest.fn();
      const dropResult: DropResult = {
        draggableId: '1-1',
        type: 'any',
        source: {
          droppableId: 'list',
          index: 4,
        },
        destination: undefined,
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
      expect(mockOnDragEnd).toHaveBeenCalledTimes(0);
    });
  });

  describe('#getDragPosition', () => {
    it('returns the top element', () => {
      expect(Tree.getDragPosition(treeWithTwoBranches, [0])).toEqual({
        parentId: '1',
        index: 0,
      });
    });

    it('returns the top element of a sublist', () => {
      expect(Tree.getDragPosition(treeWithTwoBranches, [0, 0])).toEqual({
        parentId: '1-1',
        index: 0,
      });
    });

    it('returns the last element of a sublist', () => {
      expect(Tree.getDragPosition(treeWithTwoBranches, [0, 1])).toEqual({
        parentId: '1-1',
        index: 1,
      });
    });

    it('returns undefined for invalid', () => {
      expect(Tree.getDragPosition(treeWithTwoBranches, [100, 1])).toEqual(null);
    });
  });
});
