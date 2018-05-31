// @flow
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Tree from '../../src/index';
import { treeWithThreeLeaves } from '../../mockdata/treeWithThreeLeaves';

configure({ adapter: new Adapter() });

describe('@atlaskit/tree - Tree', () => {
  describe('#render', () => {
    it('renders a flat list using renderItem', () => {
      const mockRender = jest.fn();
      mockRender.mockReturnValue(<span />);
      mount(<Tree tree={treeWithThreeLeaves} renderItem={mockRender} />);
      expect(mockRender).toHaveBeenCalledTimes(3);
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[0],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[1],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[2],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
      });
    });

    it('re-renders only the items which have been changed', () => {
      const mockRender = jest.fn();
      mockRender.mockReturnValue(<span />);
      const wrapper = mount(
        <Tree tree={treeWithThreeLeaves} renderItem={mockRender} />,
      );
      expect(mockRender).toHaveBeenCalledTimes(3);
      mockRender.mockClear();
      const mutatedTree = {
        ...treeWithThreeLeaves,
        children: [
          treeWithThreeLeaves.children[0],
          treeWithThreeLeaves.children[1],
          { ...treeWithThreeLeaves.children[2] },
        ],
      };
      wrapper.setProps({ tree: mutatedTree, renderItem: mockRender });
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender).toBeCalledWith({
        item: mutatedTree.children[2],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
      });
    });
  });

  describe('#onExpand', () => {
    it('calls with the right item', () => {
      const mockRender = jest.fn();
      mockRender.mockReturnValue(<span />);
      const mockOnExpand = jest.fn();
      const firstItem = treeWithThreeLeaves.children[0];
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
      const mockRender = jest.fn();
      mockRender.mockReturnValue(<span />);
      const mockOnCollapse = jest.fn();
      const firstItem = treeWithThreeLeaves.children[0];
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
});
