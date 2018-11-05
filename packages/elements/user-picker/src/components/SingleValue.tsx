import Avatar, { AvatarItem } from '@atlaskit/avatar';
import * as React from 'react';
import styled from 'styled-components';

const AvatarItemComponent = styled.div`
  border: none;
  padding: 0;
  margin-left: 4px;
  width: auto;
  overflow: hidden;

  & > span {
    box-sizing: border-box;
  }

  &:hover {
    width: auto;
    margin-left: 4px;
    padding: 0;
    border: none;
  }
`;

export const SingleValue = props => {
  const {
    data: {
      user: { avatarUrl, name, nickname },
    },
    selectProps: { appearance },
  } = props;
  const displayName = name || nickname;
  return (
    <AvatarItem
      backgroundColor="transparent"
      avatar={
        <Avatar
          src={avatarUrl}
          size={appearance === 'normal' ? 'small' : 'xsmall'}
          name={displayName}
          isHover={false}
        />
      }
      primaryText={displayName}
      component={AvatarItemComponent}
    />
  );
};
