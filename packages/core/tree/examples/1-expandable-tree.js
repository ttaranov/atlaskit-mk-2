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
} from '../src/';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';

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

export default class StaticTree extends Component<void, State> {
  state = {
    tree: treeWithTwoBranches,
  };

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
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

  renderItem = ({
    item,
    depth,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams) => (
    <div key={item.id} style={{ paddingLeft: depth * PADDING_PER_LEVEL }}>
      <AkNavigationItem
        text={item.data ? item.data.title : ''}
        icon={StaticTree.getIcon(item, onExpand, onCollapse)}
        onKeyDown={event => this.onKeyDown(event, item, onExpand, onCollapse)}
        dnd={provided}
      />
    </div>
  );

  onKeyDown = (
    event: KeyboardEvent,
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) => {
    if (event.key === 'Enter' && item.hasChildren) {
      if (item.isExpanded) {
        onCollapse(item.id);
      } else {
        onExpand(item.id);
      }
    }
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
