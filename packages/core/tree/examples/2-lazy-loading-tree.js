//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Spinner from '@atlaskit/spinner';
import Tree from '../src/';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';
import type { TreeItem, TreeData, ItemId } from '../src/types';
import type { RenderItemParams } from '../src/components/Tree-types';
import { mutateTree } from '../src/utils/tree';

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

export default class LazyTree extends Component<void, State> {
  state = {
    tree: mutateTree(treeWithTwoBranches, '1-1', { isExpanded: false }),
  };

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
    if (item.isChildrenLoading) {
      return (
        <SpinnerContainer onClick={() => onCollapse(item.id)}>
          <Spinner size={16} />
        </SpinnerContainer>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <ChevronDownIcon
          label=""
          size="medium"
          onClick={() => onCollapse(item.id)}
        />
      ) : (
        <ChevronRightIcon
          label=""
          size="medium"
          onClick={() => onExpand(item.id)}
        />
      );
    }
    return <Dot>&bull;</Dot>;
  }

  renderItem = ({ item, depth, onExpand, onCollapse }: RenderItemParams) => (
    <div key={item.id} style={{ paddingLeft: depth * LEFT_PADDING }}>
      <AkNavigationItem
        text={item.data ? item.data.title : ''}
        icon={LazyTree.getIcon(item, onExpand, onCollapse)}
      />
    </div>
  );

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isChildrenLoading: true }),
    });
    setTimeout(() => {
      const freshTree = this.state.tree;
      const currentItem: TreeItem = freshTree.items[itemId];
      if (currentItem.isChildrenLoading) {
        this.setState({
          tree: mutateTree(freshTree, itemId, {
            isExpanded: true,
            isChildrenLoading: false,
          }),
        });
      }
    }, 2000);
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, {
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
