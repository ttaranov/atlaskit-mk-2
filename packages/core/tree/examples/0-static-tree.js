import React from 'react';
import styled from 'styled-components';
import Tree from '../src/';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';
import { AkNavigationItem } from '@atlaskit/navigation/src/index';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

const LEFT_PADDING = 35;

const Dot = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

export default function Example() {
  return (
    <Tree
      tree={treeWithTwoBranches}
      renderItem={({ item, level }) => {
        const icon =
          item.children && item.children.length > 0 ? (
            item.isExpanded ? (
              <ChevronDownIcon label="" size="medium" />
            ) : (
              <ChevronRightIcon label="" size="medium" />
            )
          ) : (
            <Dot>&bull;</Dot>
          );

        return (
          <div style={{ paddingLeft: level * LEFT_PADDING }}>
            <AkNavigationItem text={item.data.title} icon={icon} />
          </div>
        );
      }}
    />
  );
}
