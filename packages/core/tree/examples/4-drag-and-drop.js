//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tree, {
  mutateTree,
  type RenderItemParams,
  type TreeItem,
  type TreeData,
  type ItemId,
  type TreePosition,
} from '../src';
import { complexTree } from '../mockdata/complexTree';

const PADDING_PER_LEVEL = 35;

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

export default class DragDropTree extends Component<void, State> {
  state = {
    tree: complexTree,
  };

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
    if (item.children && item.children.length > 0) {
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

  renderItem = ({
    item,
    depth,
    onExpand,
    onCollapse,
    provided,
    snapshot,
  }: RenderItemParams) => {
    return (
      <div key={item.id} style={{ paddingLeft: depth * PADDING_PER_LEVEL }}>
        <AkNavigationItem
          isDragging={snapshot.isDragging}
          text={item.data ? item.data.title : ''}
          icon={DragDropTree.getIcon(item, onExpand, onCollapse)}
          dnd={provided}
        />
      </div>
    );
  };

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  onDragEnd = (source: TreePosition, destination: ?TreePosition) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    const sourceParent: TreeItem = tree.items[source.parentId];
    const itemIdToMove = sourceParent.children[source.index];
    const newSourceChildren = [...sourceParent.children];
    newSourceChildren.splice(source.index, 1);
    const treeWithoutSource = mutateTree(tree, source.parentId, {
      children: newSourceChildren,
    });

    const destinationParent: TreeItem =
      treeWithoutSource.items[destination.parentId];
    const newDestinationChildren = [...destinationParent.children];
    newDestinationChildren.splice(destination.index, 0, itemIdToMove);
    const treeWithTheItem = mutateTree(
      treeWithoutSource,
      destination.parentId,
      { children: newDestinationChildren },
    );
    this.setState({
      tree: treeWithTheItem,
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
            onDragEnd={this.onDragEnd}
            isDragEnabled
          />
        </Navigation>
      </Container>
    );
  }
}
