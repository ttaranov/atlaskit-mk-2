import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Item from '@atlaskit/item';
import Lozenge from '@atlaskit/lozenge';
import * as React from 'react';
import { User } from '../types';
import { HighlightText } from './HighlightText';

export interface Props {
  user: User;
  status?: 'online' | 'busy' | 'focus' | 'offline';
}

export default class UserPickerItem extends React.PureComponent<Props> {
  private renderAvatar = () => {
    const {
      user: { avatarUrl },
      status,
    } = this.props;
    return <Avatar src={avatarUrl} size="medium" presence={status} />;
  };

  private renderLozenge = () => {
    const {
      user: { lozenge },
    } = this.props;
    if (lozenge) {
      return <Lozenge>{lozenge}</Lozenge>;
    }
    return undefined;
  };

  render() {
    const {
      user: { highlight, name, nickname },
    } = this.props;
    const nameHighlights = highlight && highlight.name;
    const secondaryHighlights = highlight && highlight.nickname;

    return (
      <Item elemAfter={this.renderLozenge()}>
        <AvatarItem
          backgroundColor="transparent"
          avatar={this.renderAvatar()}
          primaryText={
            <HighlightText highlights={nameHighlights}>{name}</HighlightText>
          }
          secondaryText={
            <HighlightText highlights={secondaryHighlights}>
              {nickname}
            </HighlightText>
          }
        />
      </Item>
    );
  }
}
