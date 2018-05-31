//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Spinner from '@atlaskit/spinner';
import Tree from '../src/';
import type { TreeItem, TreeData, Path } from '../src/types';
import type { RenderItemParams } from '../src/components/Tree-types';
import { getItem, mutateTree } from '../src/utils/tree';
import { range } from '../src/utils/handy';

const LEFT_PADDING = 35;

const Container = styled.div`
  display: flex;
`;

const Dot = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

const SpinnerContainer = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

type State = {|
  tree: TreeData,
|};

const addRandomChildren = (tree: TreeData, path: Path, n: number): TreeData => {
  const generateChildren = range(n).map(() => {
    return {
      id: Math.random(),
      children: [],
      hasChildren: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: { title: `Title ${path.length}` },
    };
  });
  const newChildren = [...getItem(tree, path).children, ...generateChildren];
  return mutateTree(tree, path, { children: newChildren });
};

const starterTree = {
  id: '1',
  children: [],
  hasChildren: true,
  isExpanded: true,
  isChildrenLoading: false,
  data: {},
};

export default class InfiniteTree extends Component<void, State> {
  state = {
    tree: addRandomChildren(starterTree, [], 20),
  };

  static getIcon(
    item: TreeItem,
    onExpand: (item: TreeItem) => void,
    onCollapse: (item: TreeItem) => void,
  ) {
    if (item.isChildrenLoading) {
      return (
        <SpinnerContainer onClick={() => onCollapse(item)}>
          <Spinner size={16} />
        </SpinnerContainer>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <ChevronDownIcon
          label=""
          size="medium"
          onClick={() => onCollapse(item)}
        />
      ) : (
        <ChevronRightIcon
          label=""
          size="medium"
          onClick={() => onExpand(item)}
        />
      );
    }
    return <Dot>&bull;</Dot>;
  }

  renderItem = ({ item, depth, onExpand, onCollapse }: RenderItemParams) => {
    console.log('render');
    return (
      <div key={item.id} style={{ paddingLeft: depth * LEFT_PADDING }}>
        <AkNavigationItem
          text={item.data ? item.data.title : ''}
          icon={InfiniteTree.getIcon(item, onExpand, onCollapse)}
        />
      </div>
    );
  };

  onExpand = (item: TreeItem, path: Path) => {
    const { tree }: State = this.state;
    const newTree = mutateTree(tree, path, { isExpanded: true });
    const newerTree = addRandomChildren(newTree, path, 20);
    this.setState({
      tree: newerTree,
    });
  };

  onCollapse = (item: TreeItem, path: Path) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, path, {
        isExpanded: false,
        isChildrenLoading: false,
      }),
    });
  };

  render() {
    const { tree } = this.state;

    return (
      <Container>
        <Navigation>
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
          />
        </Navigation>
      </Container>
    );
  }
}
