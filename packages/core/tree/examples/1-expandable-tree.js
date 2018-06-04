//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tree from '../src/';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';
import type { TreeItem, TreeData } from '../src/types';
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

type State = {|
  tree: TreeData,
|};

export default class StaticTree extends Component<void, State> {
  state = {
    tree: treeWithTwoBranches,
  };

  static getIcon(
    item: TreeItem,
    onExpand: (item: TreeItem) => void,
    onCollapse: (item: TreeItem) => void,
  ) {
    if (item.children && item.children.length > 0) {
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

  renderItem = ({ item, depth, onExpand, onCollapse }: RenderItemParams) => (
    <div key={item.id} style={{ paddingLeft: depth * LEFT_PADDING }}>
      <AkNavigationItem
        text={item.data ? item.data.title : ''}
        icon={StaticTree.getIcon(item, onExpand, onCollapse)}
      />
    </div>
  );

  onExpand = (item: TreeItem) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, item.id, { isExpanded: true }),
    });
  };

  onCollapse = (item: TreeItem) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, item.id, { isExpanded: false }),
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
