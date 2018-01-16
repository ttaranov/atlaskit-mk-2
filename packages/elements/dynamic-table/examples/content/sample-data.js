// @flow
/* sample-data.js */
import React from 'react';
import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import styled from 'styled-components';
import presidents from './presidents.json';
import lorem from './lorem.json';

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

function getRandomString() {
  return `${lorem[Math.floor(Math.random() * lorem.length)].split('.')[0]}.`;
}

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

export const caption = 'List of US Presidents';

export const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: 25,
    },
    {
      key: 'party',
      content: 'Party',
      shouldTruncate: true,
      isSortable: true,
      width: 15,
    },
    {
      key: 'term',
      content: 'Term',
      shouldTruncate: true,
      isSortable: true,
      width: 10,
    },
    {
      key: 'content',
      content: 'Comment',
      shouldTruncate: true,
    },
    {
      key: 'more',
      shouldTruncate: true,
    },
  ],
};

export const rows = presidents.map((president, index) => ({
  key: `row-${index}-${president.nm}`,
  cells: [
    {
      key: createKey(president.nm),
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={president.nm}
              size="medium"
              src={`https://api.adorable.io/avatars/24/${encodeURIComponent(president.nm)}.png`}
            />
          </AvatarWrapper>
          <a href="https://atlassian.design">{president.nm}</a>
        </NameWrapper>
      ),
    },
    {
      key: createKey(president.pp),
      content: president.pp,
    },
    {
      key: president.id,
      content: president.tm,
    },
    {
      content: getRandomString(),
    },
    {
      content: (
        <DropdownMenu
        trigger="More"
        triggerType="button"
      >
        <DropdownItemGroup>
          <DropdownItem>{president.nm}</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
      ),
    },
  ],
}));
