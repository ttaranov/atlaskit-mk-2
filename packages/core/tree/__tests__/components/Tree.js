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
      mount(<Tree tree={treeWithThreeLeaves} renderItem={mockRender} />);
      expect(mockRender).toHaveBeenCalledTimes(3);
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[0],
        level: 0,
        isDragged: false,
        isHovered: false,
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[1],
        level: 0,
        isDragged: false,
        isHovered: false,
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.children[2],
        level: 0,
        isDragged: false,
        isHovered: false,
      });
    });
  });
});
