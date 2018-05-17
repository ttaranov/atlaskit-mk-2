//@flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { AkNavigationItem } from '@atlaskit/navigation/src/index';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tree from '../src/';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';
import type { Item } from '../src/types';

const LEFT_PADDING = 35;

const Dot = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

export default class StaticTree extends Component<void> {
  static getIcon(item: Item) {
    if (item.children && item.children.length > 0) {
      return item.isExpanded ? (
        <ChevronDownIcon label="" size="medium" />
      ) : (
        <ChevronRightIcon label="" size="medium" />
      );
    }
    return <Dot>&bull;</Dot>;
  }

  render() {
    return (
      <Tree
        tree={treeWithTwoBranches}
        renderItem={({ item, level }) => (
          <div style={{ paddingLeft: level * LEFT_PADDING }}>
            <AkNavigationItem
              text={item.data ? item.data.title : ''}
              icon={StaticTree.getIcon(item)}
            />
          </div>
        )}
      />
    );
  }
}
