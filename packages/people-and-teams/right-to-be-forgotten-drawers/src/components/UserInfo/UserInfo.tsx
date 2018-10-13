import * as React from 'react';
import Avatar from '@atlaskit/avatar';

import getAvatarUrlByUserId from '../../util/getAvatarUrlByUserId';
import { User } from '../../types';
import * as Styled from './styles';

import { avatarCdnUrl } from '../../__temp_mocks__';

interface Props {
  user: User;
}

export class UserInfo extends React.Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <Styled.UserInfoOuter>
        <Avatar
          size="large"
          src={getAvatarUrlByUserId(avatarCdnUrl, user.id)}
        />
        <Styled.UserDetails>
          <Styled.UserName>{user.fullName}</Styled.UserName>
          <Styled.UserEmail>{user.email}</Styled.UserEmail>
        </Styled.UserDetails>
      </Styled.UserInfoOuter>
    );
  }
}

export default UserInfo;
