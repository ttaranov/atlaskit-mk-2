import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { contentPreviewMessages } from '../../messages';
import { User } from '../../types';
import UserInfo from '../UserInfo';
import * as Styled from './styled';

interface Props {
  user: User;
}

export class DeleteUserContentPreviewScreen extends React.Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <Styled.Screen>
        <Styled.Title>
          <FormattedMessage {...contentPreviewMessages.heading} />
        </Styled.Title>
        <UserInfo user={user} />
        Content preview
      </Styled.Screen>
    );
  }
}

export default DeleteUserContentPreviewScreen;
