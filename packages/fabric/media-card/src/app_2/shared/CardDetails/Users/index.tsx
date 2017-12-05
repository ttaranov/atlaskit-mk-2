import * as React from 'react';
import { AvatarGroup } from '@atlaskit/avatar';
import { UserViewModel } from '../../../ViewModel';
import { Wrapper } from './styled';

export interface UsersProps {
  users?: UserViewModel[];
}

export default class Users extends React.Component<UsersProps> {
  /* prevent the link handler from opening a URL when clicked */
  handleAvatarClick = ({ event }: { event: MouseEvent }) => {
    event.preventDefault();
  };

  /* prevent the link handler from opening a URL when clicked */
  handleMoreClick = (event: MouseEvent) => {
    event.preventDefault();
  };

  render() {
    const { users = [] } = this.props;

    if (users.length === 0) {
      return null;
    }

    return (
      <Wrapper>
        <AvatarGroup
          appearance="stack"
          size="small"
          data={users.map(user => ({
            name: user.icon.label,
            src: user.icon.url,
            size: 'small',
          }))}
          onAvatarClick={this.handleAvatarClick}
          onMoreClick={this.handleMoreClick}
        />
      </Wrapper>
    );
  }
}
