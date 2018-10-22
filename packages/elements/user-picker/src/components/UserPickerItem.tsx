import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import * as React from 'react';
import styled from 'styled-components';
import { HighlightRange, User } from '../types';
import { HighlightText } from './HighlightText';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const AvatarItemWrapper = styled.div`
  overflow: hidden;

  & > span {
    box-sizing: border-box;
  }
`;

const LozengeWrapper = styled.div`
  margin-left: 8px;
`;

export interface Props {
  user: User;
  status?: 'online' | 'busy' | 'focus' | 'offline';
  innerRef?: React.Ref<unknown>;
  context?: 'menu' | 'value';
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
      context,
    } = this.props;
    if (lozenge && context === 'menu') {
      return (
        <LozengeWrapper>
          <Lozenge>{lozenge}</Lozenge>
        </LozengeWrapper>
      );
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

  private highlightText = (text?: string, highlights?: HighlightRange[]) => {
    if (!text) {
      return undefined;
    }
    if (!highlights || this.props.context !== 'menu') {
      return text;
    }
    return <HighlightText highlights={highlights}>{text}</HighlightText>;
  };

  render() {
    const {
      user: { highlight },
    } = this.props;
    const primaryHighlights = highlight && highlight.name;
    const secondaryHighlights = highlight && highlight.nickname;
    const { primaryText, secondaryText } = this.generateAvatarText();

    return (
      <Container>
        <AvatarItemWrapper>
          <AvatarItem
            backgroundColor="transparent"
            avatar={this.renderAvatar()}
            primaryText={this.highlightText(primaryText, primaryHighlights)}
            secondaryText={this.highlightText(
              secondaryText,
              secondaryHighlights,
            )}
          />
        </AvatarItemWrapper>
        {this.renderLozenge()}
      </Container>
    );
  }
}
