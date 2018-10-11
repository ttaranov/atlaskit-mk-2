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

interface AvatarText {
  primaryText: string;
  secondaryText?: string;
}

export default class UserPickerItem extends React.PureComponent<Props> {
  private renderAvatar = () => {
    const {
      user: { avatarUrl, name },
      status,
    } = this.props;
    return (
      <Avatar src={avatarUrl} size="medium" presence={status} name={name} />
    );
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

  private generateAvatarText = (): AvatarText => {
    const {
      user: { name, nickname },
    } = this.props;
    if (name) {
      return {
        primaryText: name,
        secondaryText: nickname,
      };
    }
    return { primaryText: nickname };
  };

  render() {
    const {
      user: { highlight },
    } = this.props;
    const nameHighlights = highlight && highlight.name;
    const secondaryHighlights = highlight && highlight.nickname;
    const { primaryText, secondaryText } = this.generateAvatarText();

    return (
      <Item elemAfter={this.renderLozenge()}>
        <AvatarItem
          backgroundColor="transparent"
          avatar={this.renderAvatar()}
          primaryText={
            <HighlightText highlights={nameHighlights}>
              {primaryText}
            </HighlightText>
          }
          secondaryText={
            secondaryText ? (
              <HighlightText highlights={secondaryHighlights}>
                {secondaryText}
              </HighlightText>
            ) : (
              undefined
            )
          }
        />
      </Item>
    );
  }
}
